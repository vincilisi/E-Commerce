<<<<<<< HEAD
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
=======
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/email';
>>>>>>> master

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover'
}); const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Gestisci eventi
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId || '';

        if (orderId) {
<<<<<<< HEAD
=======
            const existingOrder = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            if (!existingOrder) {
                return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
            }

            if (existingOrder.status === 'paid') {
                return NextResponse.json({ received: true });
            }

>>>>>>> master
            // Aggiorna lo stato dell'ordine
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'paid',
                    stripePaymentId: session.id
                }
            });

<<<<<<< HEAD
=======
            await sendOrderConfirmation({
                customerName: existingOrder.customerName,
                customerEmail: existingOrder.customerEmail,
                orderNumber: existingOrder.orderNumber || existingOrder.id,
                totalAmount: existingOrder.totalAmount,
                shippingAddress: existingOrder.shippingAddress,
                items: existingOrder.orderItems.map((item) => ({
                    name: item.product?.name || item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod: 'stripe',
                status: 'paid'
            }).catch((error) => {
                console.error('Errore invio email ordine Stripe:', error);
            });

>>>>>>> master
            console.log(`Order ${orderId} marked as paid`);
        }
    } if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
    }

    return NextResponse.json({ received: true });
}
