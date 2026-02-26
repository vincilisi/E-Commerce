export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterWelcome } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email non valida' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase();

        const existing = await prisma.newsletter.findUnique({
            where: { email: normalizedEmail }
        });

        if (existing) {
            if (existing.subscribed) {
                return NextResponse.json({ error: 'Email già registrata' }, { status: 400 });
            } else {
                // Riattiva iscrizione
                await prisma.newsletter.update({
                    where: { email: normalizedEmail },
                    data: { subscribed: true }
                });
                // Invia email di benvenuto
                await sendNewsletterWelcome(normalizedEmail);
                return NextResponse.json({ message: 'Iscrizione riattivata con successo!' });
            }
        }

        await prisma.newsletter.create({
            data: { email: normalizedEmail }
        });

        // Invia email di benvenuto
        await sendNewsletterWelcome(normalizedEmail);

        return NextResponse.json({ message: 'Iscrizione alla newsletter completata!' });

    } catch (error: any) {
        console.error('Error subscribing to newsletter:', error);
        return NextResponse.json({
            error: 'Errore nell\'iscrizione alla newsletter',
            details: error.message
        }, { status: 500 });
    }
}
