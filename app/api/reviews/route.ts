export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Ottenere recensioni (tutte o per prodotto)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        const where = productId ? { productId } : {}

        const reviews = await prisma.review.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: { name: true, images: true }
                }
            }
        })

        // Calcola statistiche
        const stats = await prisma.review.groupBy({
            by: ['productId'],
            where,
            _avg: { rating: true },
            _count: { rating: true }
        })

        return NextResponse.json({ reviews, stats })
    } catch (error) {
        console.error('Errore recupero recensioni:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Creare una recensione
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        // Validazione input con Zod
        const { z } = await import('zod');
        const reviewSchema = z.object({
            productId: z.string().min(1),
            userId: z.string().min(1),
            userName: z.string().min(2).max(50),
            rating: z.number().int().min(1).max(5),
            comment: z.string().min(5).max(1000),
            orderNumber: z.string().optional()
        });
        const parsed = reviewSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });
        }
        const { productId, userId, userName, rating, comment, orderNumber } = parsed.data;

        // Verifica che l'ordine esista e contenga il prodotto (opzionale per demo)
        if (orderNumber) {
            const order = await prisma.order.findFirst({
                where: {
                    orderNumber,
                    status: { in: ['delivered', 'shipped', 'paid'] }
                },
                include: { orderItems: true }
            })

            if (!order) {
                return NextResponse.json({
                    error: 'Ordine non trovato o non ancora consegnato'
                }, { status: 400 })
            }

            const hasProduct = order.orderItems.some(item => item.productId === productId)
            if (!hasProduct) {
                return NextResponse.json({
                    error: 'Questo prodotto non è presente nel tuo ordine'
                }, { status: 400 })
            }
        }

        // Verifica se l'utente ha già recensito questo prodotto
        const existingReview = await prisma.review.findFirst({
            where: {
                productId,
                OR: [
                    { userId: userId || undefined },
                    { userName: userName }
                ]
            }
        })

        if (existingReview) {
            return NextResponse.json({
                error: 'Hai già recensito questo prodotto'
            }, { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                productId,
                userId: userId || 'anonymous',
                userName,
                rating: Math.min(5, Math.max(1, rating)),
                comment
            }
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error('Errore creazione recensione:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
