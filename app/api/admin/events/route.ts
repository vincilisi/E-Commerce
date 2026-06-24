export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lista tutti gli eventi
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Errore nel recupero degli eventi' }, { status: 500 });
    }
}

// POST - Crea nuovo evento
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const event = await prisma.event.create({
            data: {
                title: body.title,
                description: body.description,
                image: body.image || null,
                date: new Date(body.date),
                endDate: body.endDate ? new Date(body.endDate) : null,
                location: body.location || null,
                price: body.price || 0,
                maxAttendees: body.maxAttendees || null,
                active: body.active ?? true,
                featured: body.featured ?? false,
            }
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Errore nella creazione dell\'evento' }, { status: 500 });
    }
}
