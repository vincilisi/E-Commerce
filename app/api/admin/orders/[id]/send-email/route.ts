import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendShippingNotification, sendOrderConfirmation, sendOrderDelivered } from '@/lib/email';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { type } = await request.json();

        // Recupera l'ordine
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
        }

        let result;

        switch (type) {
            case 'confirmation':
                result = await sendOrderConfirmation({
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    orderNumber: order.orderNumber || order.id,
                    totalAmount: order.totalAmount,
                    shippingAddress: order.shippingAddress
                });
                break;

            case 'shipping':
                if (!order.trackingNumber) {
                    return NextResponse.json({ error: 'Numero di tracking non impostato' }, { status: 400 });
                }
                result = await sendShippingNotification({
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    orderNumber: order.orderNumber || order.id,
                    trackingNumber: order.trackingNumber,
                    shippingAddress: order.shippingAddress
                });
                break;

            case 'delivered':
                result = await sendOrderDelivered({
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    orderNumber: order.orderNumber || order.id
                });
                break;

            default:
                return NextResponse.json({ error: 'Tipo email non valido' }, { status: 400 });
        }

        if (result.success) {
            return NextResponse.json({ message: 'Email inviata con successo' });
        } else {
            return NextResponse.json({ error: result.error || 'Errore nell\'invio email' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error sending order email:', error);
        return NextResponse.json({ error: 'Errore nell\'invio dell\'email' }, { status: 500 });
    }
}
