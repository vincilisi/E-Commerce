import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const SHIPPING_COST = 5;

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

function getPaypalConfig() {
    const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
    const environment = process.env.PAYPAL_ENVIRONMENT === 'live' ? 'live' : 'sandbox';
    const baseUrl = environment === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

    return { clientId, clientSecret, environment, baseUrl };
}

async function getPaypalAccessToken(baseUrl: string, clientId: string, clientSecret: string) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!tokenRes.ok) {
        const tokenError = await tokenRes.text();
        throw new Error(`PayPal token error: ${tokenError}`);
    }

    const tokenData = await tokenRes.json();
    return tokenData.access_token as string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = orderSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Dati ordine non validi', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { clientId, clientSecret, baseUrl } = getPaypalConfig();
        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'PayPal non configurato. Imposta PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET.' },
                { status: 500 }
            );
        }

        const { items, shippingInfo, userId } = parsed.data;
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalAmount = subtotal + SHIPPING_COST;
        const origin = request.nextUrl.origin;
        const productIds = items.map((item) => item.id);

        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true }
        });

        if (existingProducts.length !== productIds.length) {
            return NextResponse.json(
                { error: 'Uno o più prodotti nel carrello non sono più disponibili.' },
                { status: 400 }
            );
        }

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
                    create: items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        try {
            const accessToken = await getPaypalAccessToken(baseUrl, clientId, clientSecret);

            const paypalRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            custom_id: order.id,
                            invoice_id: order.orderNumber || `INV-${order.id}`,
                            amount: {
                                currency_code: 'EUR',
                                value: totalAmount.toFixed(2)
                            },
                            description: `Ordine ${order.orderNumber}`
                        }
                    ],
                    application_context: {
                        return_url: `${origin}/checkout/paypal/success`,
                        cancel_url: `${origin}/checkout/paypal/cancel`,
                        brand_name: 'Il Desiderio di una Stella',
                        user_action: 'PAY_NOW'
                    }
                })
            });

            const paypalData = await paypalRes.json();

            if (!paypalRes.ok) {
                throw new Error(paypalData?.message || 'Errore creazione ordine PayPal');
            }

            const approveLink = (paypalData.links || []).find((link: { rel: string; href: string }) => link.rel === 'approve')?.href;

            if (!approveLink) {
                throw new Error('Link di approvazione PayPal non trovato');
            }

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    stripePaymentId: `paypal_order_${paypalData.id}`
                }
            });

            return NextResponse.json({
                provider: 'paypal',
                orderId: order.id,
                paypalOrderId: paypalData.id,
                approveUrl: approveLink
            });
        } catch (paypalError) {
            await prisma.$transaction([
                prisma.orderItem.deleteMany({ where: { orderId: order.id } }),
                prisma.order.delete({ where: { id: order.id } })
            ]);
            throw paypalError;
        }
    } catch (error) {
        console.error('PayPal create order error:', error);
        return NextResponse.json(
            {
                error: 'Errore durante la creazione del pagamento PayPal',
                details: error instanceof Error ? error.message : 'Errore sconosciuto'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paypalOrderId = searchParams.get('paypalOrderId');

        if (!paypalOrderId) {
            return NextResponse.json({ error: 'paypalOrderId richiesto' }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: { stripePaymentId: `paypal_order_${paypalOrderId}` },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                totalAmount: true
            }
        });

        if (!order) {
            return NextResponse.json({ status: 'NOT_FOUND', message: 'Pagamento PayPal non trovato' }, { status: 404 });
        }

        return NextResponse.json({
            provider: 'paypal',
            paypalOrderId,
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.totalAmount,
            status: order.status === 'paid' ? 'COMPLETED' : 'PENDING'
        });
    } catch (error) {
        console.error('PayPal status error:', error);
        return NextResponse.json({ error: 'Errore verifica pagamento PayPal' }, { status: 500 });
    }
}
