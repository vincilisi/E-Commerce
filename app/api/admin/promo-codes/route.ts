export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lista tutti i codici promo
export async function GET() {
    try {
        const codes = await prisma.discountCode.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(codes);
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        return NextResponse.json({ error: 'Errore nel recupero dei codici promo' }, { status: 500 });
    }
}

// POST - Crea nuovo codice promo
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Verifica che il codice non esista già
        const existing = await prisma.discountCode.findUnique({
            where: { code: body.code.toUpperCase() }
        });

        if (existing) {
            return NextResponse.json({ error: 'Questo codice esiste già' }, { status: 400 });
        }

        const promoCode = await prisma.discountCode.create({
            data: {
                code: body.code.toUpperCase(),
                type: body.type, // "percentage" or "fixed"
                value: body.value,
                minPurchase: body.minPurchase || 0,
                maxUses: body.maxUses || null,
                active: body.active ?? true,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            }
        });

        return NextResponse.json(promoCode, { status: 201 });
    } catch (error) {
        console.error('Error creating promo code:', error);
        return NextResponse.json({ error: 'Errore nella creazione del codice promo' }, { status: 500 });
    }
}
