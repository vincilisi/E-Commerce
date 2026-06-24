export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const token = req.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
        }

        const verified = await jwtVerify(token, secret);
        const userId = verified.payload.userId as string | undefined;
        if (!userId) {
            return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utente non trovato' }, { status: 401 });
        }

        const { rating, comment } = await req.json();

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Valutazione non valida' }, { status: 400 });
        }

        if (!comment || comment.trim().length === 0) {
            return NextResponse.json({ error: 'Commento richiesto' }, { status: 400 });
        }

        const { id } = await context.params
        const review = await prisma.review.create({
            data: {
                productId: id,
                userId: user.id,
                userName: user.name || 'Cliente',
                rating,
                comment: comment.trim()
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: unknown) {
        const details = error instanceof Error ? error.message : 'Errore sconosciuto';
        console.error('Error creating review:', error);
        return NextResponse.json({
            error: 'Errore nella creazione della recensione',
            details
        }, { status: 500 });
    }
}
