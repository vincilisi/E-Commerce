import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

        const smtpHost = process.env.SMTP_HOST?.trim();
        const smtpPort = Number(process.env.SMTP_PORT || '587');
        const smtpUser = process.env.SMTP_USER?.trim();
        const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '').trim();
        const hasSmtpConfig = Boolean(smtpHost && smtpUser && smtpPass);
        const allowDevMailbox = process.env.ALLOW_DEV_ETHEREAL === 'true';

        let transporter;
        let fromUser = smtpUser || '';
        let usingDevMailbox = false;

        if (hasSmtpConfig) {
            const smtpTransporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });

            transporter = smtpTransporter;

            try {
                await smtpTransporter.verify();
            } catch (smtpError) {
                if (process.env.NODE_ENV !== 'production' && allowDevMailbox) {
                    const testAccount = await nodemailer.createTestAccount();
                    transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        secure: false,
                        auth: {
                            user: testAccount.user,
                            pass: testAccount.pass
                        }
                    });
                    fromUser = testAccount.user;
                    usingDevMailbox = true;
                } else {
                    throw smtpError;
                }
            }
        } else if (process.env.NODE_ENV !== 'production' && allowDevMailbox) {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            fromUser = testAccount.user;
            usingDevMailbox = true;
        } else {
            return NextResponse.json(
                { error: 'Server email non configurato. Imposta SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (oppure ALLOW_DEV_ETHEREAL=true solo per test).' },
                { status: 500 }
            );
        }

        const siteName = settings?.siteName || 'Il Desiderio di una Stella';
        const smtpFrom = process.env.SMTP_FROM?.trim();
        const hasPlaceholderFrom = Boolean(smtpFrom && smtpFrom.includes('la-tua-email'));
        const fromAddress = !smtpFrom || hasPlaceholderFrom
            ? `"${siteName}" <${fromUser}>`
            : smtpFrom;
        const subject = `Contatti: ${oggetto} (da ${nome})`;

        const text = [
            `Nome: ${nome}`,
            `Email: ${email}`,
            `Oggetto: ${oggetto}`,
            '',
            'Messaggio:',
            messaggio
        ].join('\n');

        const html = `
            <h2>Nuovo messaggio dal form contatti</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Oggetto:</strong> ${oggetto}</p>
            <p><strong>Messaggio:</strong></p>
            <p style="white-space: pre-line;">${messaggio.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        `;

        const info = await transporter.sendMail({
            from: fromAddress,
            to: destinationEmail,
            replyTo: email,
            subject,
            text,
            html
        });

        const previewUrl = usingDevMailbox ? nodemailer.getTestMessageUrl(info) : null;

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
            previewUrl,
            mode: usingDevMailbox ? 'dev-ethereal' : 'smtp'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';

        const isGmailAuthError =
            errorMessage.includes('535-5.7.8') ||
            errorMessage.toLowerCase().includes('username and password not accepted') ||
            errorMessage.toLowerCase().includes('badcredentials');

        if (isGmailAuthError) {
            return NextResponse.json(
                {
                    error: 'Autenticazione Gmail SMTP fallita. Verifica SMTP_USER e usa una App Password Google valida (16 caratteri), non la password normale dell\'account.'
                },
                { status: 500 }
            );
        }

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
