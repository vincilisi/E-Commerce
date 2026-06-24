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

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Errore nel caricamento dell\'ordine' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json();

        const updateData: any = {};

        if (body.status !== undefined) updateData.status = body.status;
        if (body.trackingNumber !== undefined) updateData.trackingNumber = body.trackingNumber;

        const order = await prisma.order.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Errore nell\'aggiornamento dell\'ordine' }, { status: 500 });
    }
}
