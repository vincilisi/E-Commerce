export const runtime = "nodejs";
export const revalidate = 120;

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                images: true,
                materials: true,
                tags: true
            }
        });

        return NextResponse.json(
            { products },
            { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } }
        );
    } catch {
        return NextResponse.json({ error: 'Errore nel caricamento prodotti' }, { status: 500 });
    }
}