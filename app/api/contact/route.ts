import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const ipRequestLog = new Map<string, number[]>();

function getClientIp(req: NextRequest) {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string) {
    const now = Date.now();
    const timestamps = ipRequestLog.get(ip) || [];
    const recent = timestamps.filter((ts) => now - ts < rateLimitWindowMs);
    recent.push(now);
    ipRequestLog.set(ip, recent);
    return recent.length > maxRequestsPerWindow;
}

const contactSchema = z.object({
    nome: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    oggetto: z.string().trim().min(3).max(160),
    messaggio: z.string().trim().min(10).max(2000)
});

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req);
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Troppi tentativi. Riprova tra qualche minuto.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
            const issue = parsed.error.issues[0];
            const fieldName = issue?.path?.[0];

            const detailedError =
                fieldName === 'messaggio' && issue?.code === 'too_small'
                    ? 'Il messaggio deve contenere almeno 10 caratteri.'
                    : fieldName === 'nome' && issue?.code === 'too_small'
                        ? 'Il nome deve contenere almeno 2 caratteri.'
                        : fieldName === 'email'
                            ? 'Inserisci un indirizzo email valido.'
                            : 'Dati del messaggio non validi';

            return NextResponse.json(
                { error: detailedError },
                { status: 400 }
            );
        }

        const { nome, email, oggetto, messaggio } = parsed.data;

        const settings = await prisma.siteSettings.findFirst({
            select: {
                contactEmail: true,
                siteName: true
            }
        });

        const destinationEmail = settings?.contactEmail?.trim() || process.env.CONTACT_EMAIL?.trim();
        if (!destinationEmail) {
            return NextResponse.json(
                { error: 'Email di destinazione non configurata nelle impostazioni' },
                { status: 500 }
            );
        }

        const resendApiKey = process.env.RESEND_API_KEY?.trim();
        if (!resendApiKey) {
            return NextResponse.json(
                { error: 'Server email non configurato. Imposta RESEND_API_KEY.' },
                { status: 500 }
            );
        }

        const resend = new Resend(resendApiKey);

        const siteName = settings?.siteName || 'Il Desiderio di una Stella';
        const fromAddress = process.env.EMAIL_FROM?.trim() || `${siteName} <onboarding@resend.dev>`;
        const subject = `Contatti: ${oggetto} (da ${nome})`;

        const html = `
            <h2>Nuovo messaggio dal form contatti</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Oggetto:</strong> ${oggetto}</p>
            <p><strong>Messaggio:</strong></p>
            <p style="white-space: pre-line;">${messaggio.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        `;

        await resend.emails.send({
            from: fromAddress,
            to: destinationEmail,
            bcc: process.env.EMAIL_ADMIN_COPY_TO?.trim() || undefined,
            replyTo: email,
            subject,
            html
        });

        await prisma.emailLog.create({
            data: {
                to: destinationEmail,
                subject,
                templateName: 'contact_form',
                status: 'sent'
            }
        });

        return NextResponse.json({
            message: 'Messaggio inviato con successo',
            mode: 'resend'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';

        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'production'
                    ? 'Errore durante l\'invio del messaggio'
                    : `Errore durante l'invio del messaggio: ${errorMessage}`
            },
            { status: 500 }
        );
    }
}
