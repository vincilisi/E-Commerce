import { prisma } from '@/lib/prisma';
<<<<<<< HEAD
=======
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
>>>>>>> master

// Interfaccia per i dati delle email
interface EmailData {
    to: string;
    subject: string;
    html: string;
    templateName?: string;
<<<<<<< HEAD
=======
    text?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | Uint8Array;
        contentType?: string;
    }>;
}

interface OrderLineItem {
    name: string;
    quantity: number;
    price: number;
}

interface OrderReceiptData {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: string;
    items: OrderLineItem[];
    paymentMethod?: string;
    status?: string;
}

interface SiteBrandSettings {
    siteName: string;
    logo: string;
>>>>>>> master
}

// Template placeholders
interface TemplateVariables {
    customerName?: string;
    orderNumber?: string;
    totalAmount?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    orderItems?: string;
    shippingAddress?: string;
    siteName?: string;
    siteUrl?: string;
    unsubscribeUrl?: string;
    [key: string]: string | undefined;
}

// Funzione per sostituire i placeholder nel template
export function replacePlaceholders(template: string, variables: TemplateVariables): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(placeholder, value || '');
    }
    return result;
}

<<<<<<< HEAD
=======
async function createMailer() {
    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = Number(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '').trim();
    const smtpFrom = process.env.SMTP_FROM?.trim();
    const hasSmtpConfig = Boolean(smtpHost && smtpUser && smtpPass);

    let transporter: nodemailer.Transporter;
    let fromUser = smtpUser || '';

    if (hasSmtpConfig) {
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });

        try {
            await transporter.verify();
        } catch (smtpError) {
            if (process.env.NODE_ENV !== 'production') {
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
            } else {
                throw smtpError;
            }
        }
    } else if (process.env.NODE_ENV !== 'production') {
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
    } else {
        throw new Error('Server email non configurato. Imposta SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
    }

    const siteSettings = await getSiteBrandSettings();
    const fromEmail = smtpFrom?.match(/<([^>]+)>/)?.[1]?.trim() || smtpUser || fromUser;
    const fromAddress = `"${siteSettings.siteName}" <${fromEmail}>`;

    return { transporter, fromAddress, siteName: siteSettings.siteName };
}

async function getSiteBrandSettings(): Promise<SiteBrandSettings> {
    const siteSettings = await prisma.siteSettings.findFirst({
        select: { siteName: true, logo: true }
    });

    return {
        siteName: siteSettings?.siteName?.trim() || process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'Il tuo sito',
        logo: siteSettings?.logo || ''
    };
}

async function loadLogoImage(logo: string | null | undefined) {
    if (!logo) {
        return null;
    }

    let bytes: Uint8Array | null = null;
    let format: 'png' | 'jpg' | null = null;

    if (logo.startsWith('data:')) {
        const match = logo.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/i);
        if (!match) {
            return null;
        }

        format = match[2].toLowerCase() === 'png' ? 'png' : 'jpg';
        bytes = Uint8Array.from(Buffer.from(match[3], 'base64'));
    } else {
        const response = await fetch(logo);
        if (!response.ok) {
            return null;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('png')) {
            format = 'png';
        } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
            format = 'jpg';
        } else {
            return null;
        }
        bytes = new Uint8Array(await response.arrayBuffer());
    }

    if (!bytes || !format) {
        return null;
    }

    return { bytes, format };
}

async function buildOrderPdf(order: OrderReceiptData) {
    const siteSettings = await getSiteBrandSettings();
    const siteName = siteSettings.siteName;
    const logo = await loadLogoImage(siteSettings.logo);

    const pdf = await PDFDocument.create();
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const embeddedLogo = logo
        ? (logo.format === 'png'
            ? await pdf.embedPng(logo.bytes)
            : await pdf.embedJpg(logo.bytes))
        : null;

    let page = pdf.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const drawHeader = () => {
        page.drawRectangle({
            x: 0,
            y: pageHeight - 115,
            width: pageWidth,
            height: 115,
            color: rgb(0.57, 0.2, 0.92)
        });

        if (embeddedLogo) {
            page.drawImage(embeddedLogo, {
                x: margin,
                y: pageHeight - 95,
                width: 54,
                height: 54
            });
            page.drawText(siteName, {
                x: margin + 70,
                y: pageHeight - 64,
                size: 20,
                font: boldFont,
                color: rgb(1, 1, 1)
            });
            page.drawText(`Ordine #${order.orderNumber}`, {
                x: margin + 70,
                y: pageHeight - 86,
                size: 12,
                font,
                color: rgb(1, 1, 1)
            });
            return;
        }

        page.drawText(siteName, {
            x: margin,
            y: pageHeight - 64,
            size: 20,
            font: boldFont,
            color: rgb(1, 1, 1)
        });
        page.drawText(`Ordine #${order.orderNumber}`, {
            x: margin,
            y: pageHeight - 86,
            size: 12,
            font,
            color: rgb(1, 1, 1)
        });
    };

    const ensureSpace = async (needed: number) => {
        if (y - needed < 80) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
            await drawHeader();
            y -= 30;
        }
    };

    await drawHeader();
    y -= 150;

    page.drawText('Riepilogo ordine', {
        x: margin,
        y,
        size: 18,
        font: boldFont,
        color: rgb(0.12, 0.15, 0.19)
    });
    y -= 26;

    const summaryLines = [
        `Cliente: ${order.customerName}`,
        `Email: ${order.customerEmail}`,
        `Stato: ${order.status || 'pending'}`,
        `Pagamento: ${order.paymentMethod || 'non specificato'}`,
        `Indirizzo: ${order.shippingAddress}`
    ];

    for (const line of summaryLines) {
        await ensureSpace(20);
        page.drawText(line, {
            x: margin,
            y,
            size: 11,
            font,
            color: rgb(0.23, 0.25, 0.28)
        });
        y -= 18;
    }

    y -= 8;
    await ensureSpace(30);
    page.drawText('Prodotti', {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0.12, 0.15, 0.19)
    });
    y -= 24;

    let subtotal = 0;
    for (const item of order.items) {
        subtotal += item.price * item.quantity;
        const itemText = `${item.quantity} x ${item.name}`;
        const priceText = `€${(item.price * item.quantity).toFixed(2)}`;

        await ensureSpace(22);
        page.drawText(itemText, {
            x: margin,
            y,
            size: 11,
            font,
            color: rgb(0.23, 0.25, 0.28)
        });
        page.drawText(priceText, {
            x: pageWidth - margin - 90,
            y,
            size: 11,
            font: boldFont,
            color: rgb(0.23, 0.25, 0.28)
        });
        y -= 18;
    }

    const shipping = Math.max(0, order.totalAmount - subtotal);
    y -= 10;
    await ensureSpace(80);
    page.drawLine({
        start: { x: margin, y },
        end: { x: pageWidth - margin, y },
        thickness: 1,
        color: rgb(0.86, 0.88, 0.9)
    });
    y -= 24;

    const totals = [
        ['Subtotale', `€${subtotal.toFixed(2)}`],
        ['Spedizione', `€${shipping.toFixed(2)}`],
        ['Totale', `€${order.totalAmount.toFixed(2)}`]
    ] as const;

    for (const [label, value] of totals) {
        page.drawText(label, {
            x: margin,
            y,
            size: 12,
            font: label === 'Totale' ? boldFont : font,
            color: rgb(0.23, 0.25, 0.28)
        });
        page.drawText(value, {
            x: pageWidth - margin - 90,
            y,
            size: 12,
            font: boldFont,
            color: label === 'Totale' ? rgb(0.57, 0.2, 0.92) : rgb(0.23, 0.25, 0.28)
        });
        y -= 18;
    }

    y -= 12;
    await ensureSpace(40);
    page.drawText('Grazie per aver scelto ' + siteName, {
        x: margin,
        y,
        size: 11,
        font,
        color: rgb(0.45, 0.47, 0.5)
    });

    return Buffer.from(await pdf.save());
}

>>>>>>> master
// Template email predefiniti
export const defaultEmailTemplates = {
    order_confirmation: {
        name: 'order_confirmation',
        subject: '🎉 Ordine Confermato #{{orderNumber}}',
        body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conferma Ordine</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✨ Grazie per il tuo ordine!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Ciao <strong>{{customerName}}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Abbiamo ricevuto il tuo ordine e stiamo già preparando i tuoi prodotti con cura! 🌟
            </p>
            
            <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📦 Riepilogo Ordine</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Numero Ordine:</td>
                        <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">#{{orderNumber}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Totale:</td>
                        <td style="padding: 8px 0; color: #9333ea; font-weight: bold; text-align: right; font-size: 18px;">{{totalAmount}}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background: #fdf4ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">🏠 Indirizzo di Spedizione</h3>
                <p style="color: #6b7280; margin: 0; white-space: pre-line;">{{shippingAddress}}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{siteUrl}}/traccia-ordine?order={{orderNumber}}" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                    🔍 Traccia il tuo ordine
                </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
                Riceverai un'altra email quando il tuo ordine sarà spedito.
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                {{siteName}} - Creazioni artigianali fatte con amore ❤️
            </p>
        </div>
    </div>
</body>
</html>
`
    },

    shipping_notification: {
        name: 'shipping_notification',
        subject: '🚚 Il tuo ordine #{{orderNumber}} è stato spedito!',
        body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordine Spedito</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚚 In viaggio verso di te!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Ciao <strong>{{customerName}}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Ottime notizie! Il tuo ordine <strong>#{{orderNumber}}</strong> è stato spedito ed è in viaggio verso di te! 📦
            </p>
            
            <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: #059669; font-size: 14px; margin: 0 0 10px 0;">Numero di Tracking</p>
                <p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">{{trackingNumber}}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackingUrl}}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                    📍 Traccia la Spedizione
                </a>
            </div>
            
            <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">🏠 Verrà consegnato a:</h3>
                <p style="color: #6b7280; margin: 0; white-space: pre-line;">{{shippingAddress}}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong>Tempi di consegna stimati:</strong> 3-5 giorni lavorativi<br>
                Ti consigliamo di tenere d'occhio il tracking per sapere quando arriverà il pacco!
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                {{siteName}} - Creazioni artigianali fatte con amore ❤️
            </p>
        </div>
    </div>
</body>
</html>
`
    },

    newsletter_welcome: {
        name: 'newsletter_welcome',
        subject: '🌟 Benvenuto nella famiglia {{siteName}}!',
        body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuto nella Newsletter</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">✨ Benvenuto!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 10px 0 0 0;">Sei ora parte della nostra famiglia</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Grazie per esserti iscritto alla newsletter di <strong>{{siteName}}</strong>! 🎉
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Da oggi riceverai:
            </p>
            
            <div style="margin: 20px 0;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 24px; margin-right: 15px;">🎁</span>
                    <span style="color: #374151;">Offerte esclusive e sconti riservati</span>
                </div>
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 24px; margin-right: 15px;">✨</span>
                    <span style="color: #374151;">Anteprime sulle nuove collezioni</span>
                </div>
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 24px; margin-right: 15px;">💡</span>
                    <span style="color: #374151;">Idee regalo e ispirazioni creative</span>
                </div>
                <div style="display: flex; align-items: center; padding: 12px 0;">
                    <span style="font-size: 24px; margin-right: 15px;">🎪</span>
                    <span style="color: #374151;">Inviti ad eventi e workshop</span>
                </div>
            </div>
            
            <div style="background: #fdf4ff; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: #9333ea; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">🎁 Regalo di Benvenuto</p>
                <p style="color: #6b7280; margin: 0 0 15px 0;">Usa questo codice per il 10% di sconto sul tuo primo ordine:</p>
                <div style="background: white; border: 2px dashed #9333ea; border-radius: 8px; padding: 15px; display: inline-block;">
                    <span style="color: #9333ea; font-size: 24px; font-weight: bold; letter-spacing: 3px;">BENVENUTO10</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{siteUrl}}" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                    🛍️ Scopri i Nostri Prodotti
                </a>
            </div>
        </div>
        
        <div style="text-align: center; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                {{siteName}} - Creazioni artigianali fatte con amore ❤️
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                <a href="{{unsubscribeUrl}}" style="color: #9ca3af;">Cancella iscrizione</a>
            </p>
        </div>
    </div>
</body>
</html>
`
    },

    order_delivered: {
        name: 'order_delivered',
        subject: '🎉 Il tuo ordine #{{orderNumber}} è stato consegnato!',
        body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordine Consegnato</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Consegnato!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Ciao <strong>{{customerName}}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Il tuo ordine <strong>#{{orderNumber}}</strong> è stato consegnato con successo! 🎁
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Speriamo che i tuoi nuovi prodotti ti piacciano! Se hai un momento, ci farebbe molto piacere ricevere una tua recensione.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{siteUrl}}" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                    ⭐ Lascia una Recensione
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
                Hai bisogno di aiuto? Rispondi a questa email o contattaci!
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                {{siteName}} - Creazioni artigianali fatte con amore ❤️
            </p>
        </div>
    </div>
</body>
</html>
`
    }
};

// Funzione per inviare email (usa un servizio come Resend, SendGrid, ecc.)
// Per ora simula l'invio e salva nel log
<<<<<<< HEAD
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
=======
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string; previewUrl?: string }> {
    try {
        const { transporter, fromAddress } = await createMailer();

        const info = await transporter.sendMail({
            from: fromAddress,
            to: data.to,
            subject: data.subject,
            html: data.html,
            text: data.text,
            attachments: data.attachments
        });

        const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

>>>>>>> master
        // Log dell'email inviata
        await prisma.emailLog.create({
            data: {
                to: data.to,
                subject: data.subject,
                templateName: data.templateName,
                status: 'sent'
            }
        });

<<<<<<< HEAD
        // TODO: Integra con un servizio email reale come:
        // - Resend (https://resend.com)
        // - SendGrid (https://sendgrid.com)
        // - Mailgun (https://mailgun.com)
        // - Amazon SES
        //
        // Esempio con Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //     from: 'noreply@tuodominio.com',
        //     to: data.to,
        //     subject: data.subject,
        //     html: data.html
        // });

        console.log(`📧 Email inviata a ${data.to}: ${data.subject}`);
        return { success: true };
=======
        console.log(`📧 Email inviata a ${data.to}: ${data.subject}`);
        return { success: true, previewUrl };
>>>>>>> master
    } catch (error) {
        console.error('Errore invio email:', error);

        // Log errore
        await prisma.emailLog.create({
            data: {
                to: data.to,
                subject: data.subject,
                templateName: data.templateName,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Errore sconosciuto'
            }
        });

        return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
}

// Funzione per inviare email di conferma ordine
export async function sendOrderConfirmation(order: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: string;
<<<<<<< HEAD
}) {
    const template = defaultEmailTemplates.order_confirmation;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
=======
    items: OrderLineItem[];
    paymentMethod?: string;
    status?: string;
}) {
    const template = defaultEmailTemplates.order_confirmation;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const siteSettings = await getSiteBrandSettings();
    const siteName = siteSettings.siteName;
    const pdfBuffer = await buildOrderPdf({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.items,
        paymentMethod: order.paymentMethod,
        status: order.status
    });
>>>>>>> master

    const html = replacePlaceholders(template.body, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        totalAmount: `€${order.totalAmount.toFixed(2)}`,
        shippingAddress: order.shippingAddress,
<<<<<<< HEAD
        siteName: 'Il Desiderio di una Stella',
=======
        siteName,
>>>>>>> master
        siteUrl
    });

    const subject = replacePlaceholders(template.subject, {
        orderNumber: order.orderNumber
    });

    return sendEmail({
        to: order.customerEmail,
        subject,
        html,
<<<<<<< HEAD
        templateName: template.name
=======
        templateName: template.name,
        attachments: [{
            filename: `ordine-${order.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
        }]
>>>>>>> master
    });
}

// Funzione per inviare notifica spedizione
export async function sendShippingNotification(order: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    trackingNumber: string;
    shippingAddress: string;
}) {
    const template = defaultEmailTemplates.shipping_notification;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
<<<<<<< HEAD
=======
    const siteSettings = await getSiteBrandSettings();
    const siteName = siteSettings.siteName;
>>>>>>> master

    // Genera URL tracking (esempio con BRT/Bartolini, modifica per il tuo corriere)
    const trackingUrl = `https://vas.brt.it/vas/sped_det_show.htm?bession=&bession_cl=&referer=sped_numspe_par.htm&Ession=&NumSped=${order.trackingNumber}`;

    const html = replacePlaceholders(template.body, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        trackingUrl,
        shippingAddress: order.shippingAddress,
<<<<<<< HEAD
        siteName: 'Il Desiderio di una Stella',
=======
        siteName,
>>>>>>> master
        siteUrl
    });

    const subject = replacePlaceholders(template.subject, {
        orderNumber: order.orderNumber
    });

    return sendEmail({
        to: order.customerEmail,
        subject,
        html,
        templateName: template.name
    });
}

// Funzione per email benvenuto newsletter
export async function sendNewsletterWelcome(email: string) {
    const template = defaultEmailTemplates.newsletter_welcome;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
<<<<<<< HEAD

    const html = replacePlaceholders(template.body, {
        siteName: 'Il Desiderio di una Stella',
=======
    const siteSettings = await getSiteBrandSettings();
    const siteName = siteSettings.siteName;

    const html = replacePlaceholders(template.body, {
        siteName,
>>>>>>> master
        siteUrl,
        unsubscribeUrl: `${siteUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
    });

    const subject = replacePlaceholders(template.subject, {
<<<<<<< HEAD
        siteName: 'Il Desiderio di una Stella'
=======
        siteName
>>>>>>> master
    });

    return sendEmail({
        to: email,
        subject,
        html,
        templateName: template.name
    });
}

// Funzione per email ordine consegnato
export async function sendOrderDelivered(order: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
}) {
    const template = defaultEmailTemplates.order_delivered;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
<<<<<<< HEAD
=======
    const siteSettings = await getSiteBrandSettings();
    const siteName = siteSettings.siteName;
>>>>>>> master

    const html = replacePlaceholders(template.body, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
<<<<<<< HEAD
        siteName: 'Il Desiderio di una Stella',
=======
        siteName,
>>>>>>> master
        siteUrl
    });

    const subject = replacePlaceholders(template.subject, {
        orderNumber: order.orderNumber
    });

    return sendEmail({
        to: order.customerEmail,
        subject,
        html,
        templateName: template.name
    });
}
