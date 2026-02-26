export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                materials: true,
                tags: true,
                reviews: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Errore nel caricamento del prodotto' }, { status: 500 });
    }
}
