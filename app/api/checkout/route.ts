export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type CheckoutItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
};

type ShippingInfo = {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
};

function getBaseUrl(req: NextRequest) {
    return process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
}

function getPaypalConfig() {
    const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
    const environment = process.env.PAYPAL_ENVIRONMENT === 'live' ? 'live' : 'sandbox';
    const baseUrl = environment === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

    return { clientId, clientSecret, baseUrl };
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

async function createOrder(input: {
    items: CheckoutItem[];
    shippingInfo: ShippingInfo;
    userId?: string;
    totalAmount: number;
}) {
    const { items, shippingInfo, userId, totalAmount } = input;

    return prisma.order.create({
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
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

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
            userId: z.string().optional(),
            paymentMethod: z.enum(['paypal', 'cod']).default('paypal')
        });

        const parsed = orderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });
        }

        const { items, shippingInfo, userId, paymentMethod } = parsed.data;

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 5.0;
        const totalAmount = subtotal + shipping;

        const order = await createOrder({ items, shippingInfo, userId, totalAmount });
        const baseUrl = getBaseUrl(req);

        if (paymentMethod === 'cod') {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'processing',
                    stripePaymentId: `cod_${order.id}`
                }
            });

            for (const item of items) {
                await prisma.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return NextResponse.json({
                provider: 'cod',
                orderId: order.id,
                redirectUrl: `/ordine/successo?cod_order=${order.id}`
            });
        }

        if (paymentMethod === 'paypal') {
            const { clientId, clientSecret, baseUrl: paypalBaseUrl } = getPaypalConfig();

            if (!clientId || !clientSecret) {
                return NextResponse.json(
                    {
                        error: 'PayPal non configurato',
                        details: 'Imposta PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET nel file .env e riavvia il server.'
                    },
                    { status: 400 }
                );
            }

            const accessToken = await getPaypalAccessToken(paypalBaseUrl, clientId, clientSecret);

            const paypalRes = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
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
                            invoice_id: order.orderNumber || undefined,
                            amount: {
                                currency_code: 'EUR',
                                value: totalAmount.toFixed(2)
                            },
                            shipping: {
                                name: { full_name: shippingInfo.name },
                                address: {
                                    address_line_1: shippingInfo.address,
                                    admin_area_2: shippingInfo.city,
                                    postal_code: shippingInfo.postalCode,
                                    country_code: 'IT'
                                }
                            }
                        }
                    ],
                    application_context: {
                        return_url: `${baseUrl}/checkout/paypal/success`,
                        cancel_url: `${baseUrl}/checkout/paypal/cancel`,
                        shipping_preference: 'SET_PROVIDED_ADDRESS',
                        user_action: 'PAY_NOW'
                    }
                })
            });

            const paypalData = await paypalRes.json();
            if (!paypalRes.ok) {
                throw new Error(paypalData?.message || 'Errore creazione ordine PayPal');
            }

            const paypalOrderId = paypalData?.id as string;
            const approveUrl = (paypalData?.links || []).find((link: { rel?: string }) => link.rel === 'approve')?.href;

            if (!paypalOrderId || !approveUrl) {
                throw new Error('PayPal non ha restituito link di approvazione');
            }

            await prisma.order.update({
                where: { id: order.id },
                data: { stripePaymentId: `paypal_order_${paypalOrderId}` }
            });

            return NextResponse.json({
                provider: 'paypal',
                paypalOrderId,
                approveUrl,
                orderId: order.id
            });
        }

        return NextResponse.json(
            {
                error: 'Metodo di pagamento non disponibile',
                details: 'Al momento sono disponibili solo PayPal e pagamento alla consegna.'
            },
            { status: 400 }
        );
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({
            error: 'Errore nel checkout',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
