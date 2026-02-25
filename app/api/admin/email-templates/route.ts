import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultEmailTemplates } from '@/lib/email';

// GET - Lista tutti i template email
export async function GET() {
    try {
        // Prova a caricare i template dal database
        let templates = await prisma.emailTemplate.findMany({
            orderBy: { name: 'asc' }
        });

        // Se non ci sono template nel database, restituisci quelli di default
        if (templates.length === 0) {
            // Crea i template di default nel database
            for (const [, template] of Object.entries(defaultEmailTemplates)) {
                await prisma.emailTemplate.create({
                    data: {
                        name: template.name,
                        subject: template.subject,
                        body: template.body,
                        active: true
                    }
                });
            }

            templates = await prisma.emailTemplate.findMany({
                orderBy: { name: 'asc' }
            });
        }

        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error fetching email templates:', error);
        return NextResponse.json({ error: 'Errore nel recupero dei template' }, { status: 500 });
    }
}

// POST - Crea nuovo template email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const template = await prisma.emailTemplate.create({
            data: {
                name: body.name,
                subject: body.subject,
                body: body.body,
                active: body.active ?? true
            }
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('Error creating email template:', error);
        return NextResponse.json({ error: 'Errore nella creazione del template' }, { status: 500 });
    }
}
