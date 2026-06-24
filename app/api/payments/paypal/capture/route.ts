import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/email';

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const paypalOrderId = typeof body?.paypalOrderId === 'string' ? body.paypalOrderId.trim() : '';

        if (!paypalOrderId) {
            return NextResponse.json({ error: 'paypalOrderId richiesto' }, { status: 400 });
        }

        const existingOrder = await prisma.order.findFirst({
            where: {
                OR: [
                    { stripePaymentId: `paypal_order_${paypalOrderId}` },
                    { stripePaymentId: `paypal_capture_${paypalOrderId}` }
                ]
            }
        });

        if (existingOrder?.status === 'paid') {
            return NextResponse.json({
                success: true,
                provider: 'paypal',
                paypalOrderId,
                orderId: existingOrder.id,
                redirectUrl: `/ordine/successo?paypal_order=${paypalOrderId}`
            });
        }

        const { clientId, clientSecret, baseUrl } = getPaypalConfig();
        if (!clientId || !clientSecret) {
            if (existingOrder) {
                if (existingOrder.status !== 'paid') {
                    await prisma.order.update({
                        where: { id: existingOrder.id },
                        data: {
                            status: 'paid',
                            stripePaymentId: `paypal_capture_${paypalOrderId}`
                        }
                    });
                }

                return NextResponse.json({
                    success: true,
                    provider: 'paypal',
                    paypalOrderId,
                    orderId: existingOrder.id,
                    testMode: true,
                    redirectUrl: `/ordine/successo?paypal_order=${paypalOrderId}`
                });
            }

            return NextResponse.json(
                { error: 'PayPal non configurato. Imposta PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET.' },
                { status: 500 }
            );
        }

        const accessToken = await getPaypalAccessToken(baseUrl, clientId, clientSecret);

        const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });

        const captureData = await captureRes.json();
        if (!captureRes.ok) {
            throw new Error(captureData?.message || 'Errore cattura pagamento PayPal');
        }

        const status = captureData?.status;
        if (status !== 'COMPLETED') {
            return NextResponse.json(
                { error: `Pagamento PayPal non completato. Stato: ${status || 'sconosciuto'}` },
                { status: 400 }
            );
        }

        const customOrderId = captureData?.purchase_units?.[0]?.custom_id as string | undefined;

        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    ...(customOrderId ? [{ id: customOrderId }] : []),
                    { stripePaymentId: `paypal_order_${paypalOrderId}` },
                    { stripePaymentId: `paypal_capture_${paypalOrderId}` }
                ]
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Ordine locale non trovato per questo pagamento PayPal' }, { status: 404 });
        }

        if (order.status !== 'paid') {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'paid',
                    stripePaymentId: `paypal_capture_${paypalOrderId}`
                }
            });

            for (const item of order.orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            await sendOrderConfirmation({
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                orderNumber: order.orderNumber || order.id,
                totalAmount: order.totalAmount,
                shippingAddress: order.shippingAddress,
                items: order.orderItems.map((item) => ({
                    name: item.product?.name || item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod: 'paypal',
                status: 'paid'
            }).catch((error) => {
                console.error('Errore invio email ordine PayPal:', error);
            });
        }

        return NextResponse.json({
            success: true,
            provider: 'paypal',
            paypalOrderId,
            orderId: order.id,
            redirectUrl: `/ordine/successo?paypal_order=${paypalOrderId}`
        });
    } catch (error) {
        console.error('PayPal capture error:', error);
        return NextResponse.json(
            {
                error: 'Errore durante la conferma del pagamento PayPal',
                details: error instanceof Error ? error.message : 'Errore sconosciuto'
            },
            { status: 500 }
        );
    }
}
