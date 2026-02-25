import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Sistema di pagamento FITTIZIO per test
// Disabilita Stripe se la chiave è mancante, placeholder o invalida
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_ENABLED = STRIPE_KEY &&
    !STRIPE_KEY.includes('your-stripe') &&
    !STRIPE_KEY.includes('here') &&
    STRIPE_KEY.startsWith('sk_');

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { z } = await import('zod');
        const orderSchema = z.object({
            items: z.array(z.object({
                id: z.string().min(1),
                name: z.string().min(2),
                price: z.number().min(0),
                quantity: z.number().int().min(1),
                description: z.string().optional()
            })).min(1),
            shippingInfo: z.object({
                name: z.string().min(2),
                email: z.string().email(),
                address: z.string().min(2),
                city: z.string().min(2),
                postalCode: z.string().min(2),
                country: z.string().min(2)
            }),
            userId: z.string().optional()
        });
        const parsed = orderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });
        }
        const { items, shippingInfo, userId } = parsed.data;

        // Calcola il totale
        const totalAmount = items.reduce((sum: number, item: any) =>
            sum + (item.price * item.quantity), 0
        ) + 5.00; // Spedizione

        // Crea l'ordine nel database
        const order = await prisma.order.create({
            data: {
                userId: userId || null,
                customerName: shippingInfo.name,
                customerEmail: shippingInfo.email,
                orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                status: 'pending',
                totalAmount,
                shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        if (STRIPE_ENABLED) {
            // Usa Stripe reale
            const Stripe = require('stripe');
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
                apiVersion: '2025-12-15.clover'
            });

            const lineItems = items.map((item: any) => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                        description: item.description || '',
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            }));

            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Spedizione',
                    },
                    unit_amount: 500,
                },
                quantity: 1,
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.NEXT_PUBLIC_URL}/ordine/successo?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_URL}/carrello`,
                metadata: {
                    orderId: order.id
                }
            });

            await prisma.order.update({
                where: { id: order.id },
                data: { stripePaymentId: session.id }
            });

            return NextResponse.json({ sessionId: session.id, orderId: order.id });
        } else {
            // Modalità TEST FITTIZIO - simula pagamento riuscito automaticamente
            console.log('🧪 MODALITÀ TEST: Pagamento fittizio simulato');

            // Aggiorna ordine come pagato
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'paid',
                    stripePaymentId: `test_${Date.now()}`
                }
            });

            // Ritorna URL di successo diretto
            return NextResponse.json({
                testMode: true,
                orderId: order.id,
                redirectUrl: `/ordine/successo?test_order=${order.id}`
            });
        }
    } catch (error: any) {
        console.error('Checkout error:', error);
        // Restituisci dettagli dell'errore per debugging
        return NextResponse.json({
            error: 'Errore nel checkout',
            details: error.message || String(error),
            code: error.code
        }, { status: 500 });
    }
}
