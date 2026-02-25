import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Traccia un ordine pubblicamente
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const orderNumber = searchParams.get('orderNumber');
        const email = searchParams.get('email');

        if (!orderNumber) {
            return NextResponse.json({ error: 'Numero ordine richiesto' }, { status: 400 });
        }

        // Cerca l'ordine
        const order = await prisma.order.findFirst({
            where: {
                orderNumber: orderNumber.toUpperCase(),
                ...(email ? { customerEmail: email.toLowerCase() } : {})
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                trackingNumber: true,
                customerName: true,
                shippingAddress: true,
                totalAmount: true,
                createdAt: true,
                updatedAt: true,
                orderItems: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                name: true,
                                images: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
        }

        // Genera gli step del tracking
        const trackingSteps = generateTrackingSteps(order.status, order.createdAt, order.updatedAt);

        return NextResponse.json({
            order: {
                ...order,
                trackingSteps
            }
        });
    } catch (error) {
        console.error('Error tracking order:', error);
        return NextResponse.json({ error: 'Errore nel tracciamento dell\'ordine' }, { status: 500 });
    }
}

// Genera gli step del tracking basati sullo stato
function generateTrackingSteps(status: string, createdAt: Date, updatedAt: Date) {
    const steps = [
        {
            id: 'pending',
            title: 'Ordine Ricevuto',
            description: 'Abbiamo ricevuto il tuo ordine',
            icon: '📋',
            completed: true,
            date: createdAt
        },
        {
            id: 'paid',
            title: 'Pagamento Confermato',
            description: 'Il pagamento è stato elaborato con successo',
            icon: '💳',
            completed: ['paid', 'processing', 'shipped', 'delivered'].includes(status),
            date: ['paid', 'processing', 'shipped', 'delivered'].includes(status) ? updatedAt : null
        },
        {
            id: 'processing',
            title: 'In Preparazione',
            description: 'Stiamo preparando il tuo ordine con cura',
            icon: '📦',
            completed: ['processing', 'shipped', 'delivered'].includes(status),
            date: ['processing', 'shipped', 'delivered'].includes(status) ? updatedAt : null
        },
        {
            id: 'shipped',
            title: 'Spedito',
            description: 'Il tuo ordine è in viaggio',
            icon: '🚚',
            completed: ['shipped', 'delivered'].includes(status),
            date: ['shipped', 'delivered'].includes(status) ? updatedAt : null
        },
        {
            id: 'delivered',
            title: 'Consegnato',
            description: 'Il tuo ordine è stato consegnato',
            icon: '✅',
            completed: status === 'delivered',
            date: status === 'delivered' ? updatedAt : null
        }
    ];

    // Se l'ordine è stato cancellato
    if (status === 'cancelled') {
        return [
            ...steps.slice(0, 2),
            {
                id: 'cancelled',
                title: 'Ordine Cancellato',
                description: 'L\'ordine è stato annullato',
                icon: '❌',
                completed: true,
                date: updatedAt,
                isCancelled: true
            }
        ];
    }

    return steps;
}
