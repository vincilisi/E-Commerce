import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user');

        if (!userCookie) {
            return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
        }

        const user = JSON.parse(userCookie.value);
        const { rating, comment } = await req.json();

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Valutazione non valida' }, { status: 400 });
        }

        if (!comment || comment.trim().length === 0) {
            return NextResponse.json({ error: 'Commento richiesto' }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                productId: parseInt(params.id),
                userId: user.id,
                userName: user.name,
                rating,
                comment: comment.trim()
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        console.error('Error creating review:', error);
        return NextResponse.json({
            error: 'Errore nella creazione della recensione',
            details: error.message
        }, { status: 500 });
    }
}
