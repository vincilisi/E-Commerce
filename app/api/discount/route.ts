import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Codice sconto richiesto' }, { status: 400 });
        }

        const discount = await prisma.discountCode.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!discount) {
            return NextResponse.json({ error: 'Codice sconto non valido' }, { status: 404 });
        }

        if (!discount.active) {
            return NextResponse.json({ error: 'Codice sconto non più attivo' }, { status: 400 });
        }

        if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'Codice sconto scaduto' }, { status: 400 });
        }

        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            return NextResponse.json({ error: 'Codice sconto esaurito' }, { status: 400 });
        }

        if (cartTotal < discount.minPurchase) {
            return NextResponse.json({
                error: `Acquisto minimo di €${discount.minPurchase.toFixed(2)} richiesto`
            }, { status: 400 });
        }

        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = (cartTotal * discount.value) / 100;
        } else {
            discountAmount = discount.value;
        }

        return NextResponse.json({
            valid: true,
            discountAmount,
            finalTotal: Math.max(0, cartTotal - discountAmount),
            code: discount.code
        });

    } catch (error: any) {
        console.error('Error validating discount:', error);
        return NextResponse.json({
            error: 'Errore nella validazione del codice sconto',
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { code } = await req.json();

        await prisma.discountCode.update({
            where: { code: code.toUpperCase() },
            data: { usedCount: { increment: 1 } }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error incrementing discount usage:', error);
        return NextResponse.json({ error: 'Errore nell\'aggiornamento del codice sconto' }, { status: 500 });
    }
}
