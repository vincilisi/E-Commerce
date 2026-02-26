export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const excludeId = searchParams.get('excludeId');

        if (!category) {
            return NextResponse.json({ error: 'Categoria richiesta' }, { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                category,
                id: excludeId ? { not: String(excludeId) } : undefined
            },
            take: 8,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return NextResponse.json({ error: 'Errore nel caricamento dei prodotti correlati' }, { status: 500 });
    }
}
