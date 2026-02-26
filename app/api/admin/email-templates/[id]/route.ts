import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Singolo template
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const template = await prisma.emailTemplate.findUnique({
            where: { id }
        });

        if (!template) {
            return NextResponse.json({ error: 'Template non trovato' }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error fetching email template:', error);
        return NextResponse.json({ error: 'Errore nel recupero del template' }, { status: 500 });
    }
}

// PUT - Aggiorna template
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const template = await prisma.emailTemplate.update({
            where: { id },
            data: {
                subject: body.subject,
                body: body.body,
                active: body.active
            }
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error updating email template:', error);
        return NextResponse.json({ error: 'Errore nell\'aggiornamento del template' }, { status: 500 });
    }
}

// DELETE - Elimina template
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.emailTemplate.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Template eliminato' });
    } catch (error) {
        console.error('Error deleting email template:', error);
        return NextResponse.json({ error: 'Errore nell\'eliminazione del template' }, { status: 500 });
    }
}
