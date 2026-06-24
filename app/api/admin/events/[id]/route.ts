export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Singolo evento
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event) {
            return NextResponse.json({ error: 'Evento non trovato' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json({ error: 'Errore nel recupero dell\'evento' }, { status: 500 });
    }
}

// PUT - Aggiorna evento
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const body = await request.json();

        const event = await prisma.event.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                image: body.image || null,
                date: new Date(body.date),
                endDate: body.endDate ? new Date(body.endDate) : null,
                location: body.location || null,
                price: body.price || 0,
                maxAttendees: body.maxAttendees || null,
                attendees: body.attendees || 0,
                active: body.active ?? true,
                featured: body.featured ?? false,
            }
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Errore nell\'aggiornamento dell\'evento' }, { status: 500 });
    }
}

// DELETE - Elimina evento
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await prisma.event.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Evento eliminato con successo' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Errore nell\'eliminazione dell\'evento' }, { status: 500 });
    }
}
