import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Singolo codice promo
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const code = await prisma.discountCode.findUnique({
            where: { id: resolvedParams.id }
        });

        if (!code) {
            return NextResponse.json({ error: 'Codice promo non trovato' }, { status: 404 });
        }

        return NextResponse.json(code);
    } catch (error) {
        console.error('Error fetching promo code:', error);
        return NextResponse.json({ error: 'Errore nel recupero del codice promo' }, { status: 500 });
    }
}

// PUT - Aggiorna codice promo
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const body = await request.json();

        const promoCode = await prisma.discountCode.update({
            where: { id: resolvedParams.id },
            data: {
                code: body.code.toUpperCase(),
                type: body.type,
                value: body.value,
                minPurchase: body.minPurchase || 0,
                maxUses: body.maxUses || null,
                usedCount: body.usedCount || 0,
                active: body.active ?? true,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            }
        });

        return NextResponse.json(promoCode);
    } catch (error) {
        console.error('Error updating promo code:', error);
        return NextResponse.json({ error: 'Errore nell\'aggiornamento del codice promo' }, { status: 500 });
    }
}

// DELETE - Elimina codice promo
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        await prisma.discountCode.delete({
            where: { id: resolvedParams.id }
        });

        return NextResponse.json({ message: 'Codice promo eliminato con successo' });
    } catch (error) {
        console.error('Error deleting promo code:', error);
        return NextResponse.json({ error: 'Errore nell\'eliminazione del codice promo' }, { status: 500 });
    }
}
