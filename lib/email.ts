import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getSiteUrl } from '@/lib/site';

// Interfaccia per i dati delle email
interface EmailData {
    to: string;
    subject: string;
    html: string;
    templateName?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType?: string;
    }>;
}

type OrderEmailItem = {
    name: string;
    quantity: number;
    price: number;
};

type OrderConfirmationInput = {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: string;
    items?: OrderEmailItem[];
    paymentMethod?: 'paypal' | 'cod' | 'other';
    status?: string;
};

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
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 8px;">
                In allegato trovi la ricevuta del tuo ordine con il riepilogo dei prodotti acquistati e dell'importo pagato.
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

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function getPaymentMethodLabel(paymentMethod?: 'paypal' | 'cod' | 'other') {
    if (paymentMethod === 'paypal') return 'PayPal';
    if (paymentMethod === 'cod') return 'Pagamento alla consegna';
    return 'Pagamento online';
}

function wrapText(text: string, maxChars: number) {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (candidate.length <= maxChars) {
            currentLine = candidate;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
}

async function loadLogoBytes(logo?: string | null) {
    if (!logo) return null;

    try {
        if (logo.startsWith('data:image/')) {
            const [, mimePart, dataPart] = logo.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/) || [];
            if (!mimePart || !dataPart) return null;
            return {
                bytes: Buffer.from(dataPart, 'base64'),
                mimeType: mimePart
            };
        }

        const response = await fetch(logo);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const mimeType = response.headers.get('content-type') || 'image/png';
        return {
            bytes: Buffer.from(arrayBuffer),
            mimeType
        };
    } catch {
        return null;
    }
}

async function generateOrderReceiptPdf(order: OrderConfirmationInput) {
    const settings = await prisma.siteSettings.findFirst({
        select: {
            siteName: true,
            logo: true,
            contactEmail: true,
            contactPhone: true
        }
    });

    const siteName = settings?.siteName || 'Il Desiderio di una Stella';
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]);
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const margin = 48;

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const logoAsset = await loadLogoBytes(settings?.logo);

    let y = pageHeight - margin;

    if (logoAsset) {
        try {
            const image = logoAsset.mimeType.includes('png')
                ? await pdfDoc.embedPng(logoAsset.bytes)
                : await pdfDoc.embedJpg(logoAsset.bytes);
            const dimensions = image.scale(0.22);
            page.drawImage(image, {
                x: margin,
                y: y - dimensions.height,
                width: dimensions.width,
                height: dimensions.height
            });
        } catch {
            // Ignore logo embedding errors and continue with text-only branding.
        }
    }

    page.drawText(siteName, {
        x: margin + 92,
        y: y - 8,
        size: 22,
        font: fontBold,
        color: rgb(0.18, 0.12, 0.09)
    });
    page.drawText('Ricevuta ordine', {
        x: margin + 92,
        y: y - 30,
        size: 11,
        font: fontRegular,
        color: rgb(0.42, 0.34, 0.29)
    });
    y -= 82;

    page.drawRectangle({
        x: margin,
        y: y - 74,
        width: pageWidth - margin * 2,
        height: 74,
        color: rgb(0.98, 0.95, 0.91)
    });
    page.drawText(`Ordine: ${order.orderNumber}`, { x: margin + 16, y: y - 24, size: 12, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
    page.drawText(`Data: ${new Date().toLocaleDateString('it-IT')}`, { x: margin + 16, y: y - 44, size: 11, font: fontRegular, color: rgb(0.28, 0.22, 0.19) });
    page.drawText(`Pagamento: ${getPaymentMethodLabel(order.paymentMethod)}`, { x: pageWidth - margin - 180, y: y - 24, size: 11, font: fontRegular, color: rgb(0.28, 0.22, 0.19) });
    page.drawText(`Importo pagato: ${formatCurrency(order.totalAmount)}`, { x: pageWidth - margin - 180, y: y - 44, size: 12, font: fontBold, color: rgb(0.63, 0.23, 0.18) });
    y -= 102;

    page.drawText('Cliente', { x: margin, y, size: 12, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
    page.drawText(order.customerName, { x: margin, y: y - 18, size: 11, font: fontRegular, color: rgb(0.24, 0.18, 0.16) });
    page.drawText(order.customerEmail, { x: margin, y: y - 34, size: 11, font: fontRegular, color: rgb(0.24, 0.18, 0.16) });

    page.drawText('Indirizzo di spedizione', { x: pageWidth / 2, y, size: 12, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
    const addressLines = wrapText(order.shippingAddress || '-', 34);
    addressLines.forEach((line, index) => {
        page.drawText(line, { x: pageWidth / 2, y: y - 18 - index * 14, size: 11, font: fontRegular, color: rgb(0.24, 0.18, 0.16) });
    });
    y -= 86;

    const drawHeader = () => {
        page.drawText('Articolo', { x: margin, y, size: 11, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
        page.drawText('Qta', { x: pageWidth - margin - 160, y, size: 11, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
        page.drawText('Prezzo', { x: pageWidth - margin - 110, y, size: 11, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
        page.drawText('Totale', { x: pageWidth - margin - 48, y, size: 11, font: fontBold, color: rgb(0.17, 0.11, 0.08) });
        page.drawLine({ start: { x: margin, y: y - 8 }, end: { x: pageWidth - margin, y: y - 8 }, thickness: 1, color: rgb(0.84, 0.78, 0.72) });
        y -= 26;
    };

    drawHeader();

    const items = order.items || [];
    for (const item of items) {
        if (y < 118) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = pageHeight - margin;
            drawHeader();
        }

        const itemNameLines = wrapText(item.name, 34);
        itemNameLines.forEach((line, index) => {
            page.drawText(line, { x: margin, y: y - index * 14, size: 10.5, font: fontRegular, color: rgb(0.24, 0.18, 0.16) });
        });

        page.drawText(String(item.quantity), { x: pageWidth - margin - 154, y, size: 10.5, font: fontRegular, color: rgb(0.24, 0.18, 0.16) });
        page.drawText(formatCurrency(item.price), { x: pageWidth - margin - 118, y, size: 10.5, font: fontRegular, color: rgb(0.24, 0.18, 0.16) });
        page.drawText(formatCurrency(item.price * item.quantity), { x: pageWidth - margin - 52, y, size: 10.5, font: fontBold, color: rgb(0.17, 0.11, 0.08) });

        y -= Math.max(22, itemNameLines.length * 14 + 8);
        page.drawLine({ start: { x: margin, y: y + 4 }, end: { x: pageWidth - margin, y: y + 4 }, thickness: 0.6, color: rgb(0.92, 0.88, 0.84) });
        y -= 12;
    }

    if (y < 120) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = pageHeight - margin;
    }

    page.drawRectangle({
        x: pageWidth - margin - 210,
        y: y - 58,
        width: 210,
        height: 58,
        color: rgb(0.98, 0.95, 0.91)
    });
    page.drawText('Totale pagato', { x: pageWidth - margin - 194, y: y - 22, size: 11, font: fontRegular, color: rgb(0.28, 0.22, 0.19) });
    page.drawText(formatCurrency(order.totalAmount), { x: pageWidth - margin - 194, y: y - 42, size: 18, font: fontBold, color: rgb(0.63, 0.23, 0.18) });
    y -= 88;

    const footerLines = [
        settings?.contactEmail ? `Email: ${settings.contactEmail}` : '',
        settings?.contactPhone ? `Telefono: ${settings.contactPhone}` : '',
        'Documento riepilogativo non fiscale generato automaticamente dal negozio.'
    ].filter(Boolean);

    footerLines.forEach((line, index) => {
        page.drawText(line, { x: margin, y: y - index * 14, size: 9.5, font: fontRegular, color: rgb(0.42, 0.34, 0.29) });
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

// Funzione per inviare email (usa un servizio come Resend, SendGrid, ecc.)
// Ora invia realmente via Resend e salva sempre il log.
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
        const resendApiKey = process.env.RESEND_API_KEY?.trim();
        if (!resendApiKey) {
            throw new Error('Resend non configurato. Variabile mancante: RESEND_API_KEY');
        }

        const resend = new Resend(resendApiKey);

        const forceRecipient = process.env.EMAIL_FORCE_TO?.trim();
        const settings = await prisma.siteSettings.findFirst({
            select: { contactEmail: true }
        });
        const adminCopyRecipient = process.env.EMAIL_ADMIN_COPY_TO?.trim() || settings?.contactEmail?.trim();
        const recipient = forceRecipient || data.to;
        const bcc = adminCopyRecipient && adminCopyRecipient !== recipient ? adminCopyRecipient : undefined;

        const fromAddress = process.env.EMAIL_FROM?.trim() || 'Il Desiderio di una Stella <onboarding@resend.dev>';

        const resendPayload: {
            from: string;
            to: string;
            subject: string;
            html: string;
            bcc?: string;
            attachments?: Array<{
                filename: string;
                content: Buffer;
                contentType?: string;
            }>;
        } = {
            from: fromAddress,
            to: recipient,
            subject: data.subject,
            html: data.html,
        };

        if (bcc) {
            resendPayload.bcc = bcc;
        }

        if (data.attachments?.length) {
            resendPayload.attachments = data.attachments;
        }

        await resend.emails.send(resendPayload);

        // Log dell'email inviata
        await prisma.emailLog.create({
            data: {
                to: recipient,
                subject: data.subject,
                templateName: data.templateName,
                status: 'sent'
            }
        });

        console.log(`Email inviata via Resend a ${recipient}: ${data.subject}`);
        return { success: true };
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
export async function sendOrderConfirmation(order: OrderConfirmationInput) {
    const template = defaultEmailTemplates.order_confirmation;
    const siteUrl = getSiteUrl();
    const receiptPdf = await generateOrderReceiptPdf(order);

    const html = replacePlaceholders(template.body, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        totalAmount: `€${order.totalAmount.toFixed(2)}`,
        shippingAddress: order.shippingAddress,
        siteName: 'Il Desiderio di una Stella',
        siteUrl
    });

    const subject = replacePlaceholders(template.subject, {
        orderNumber: order.orderNumber
    });

    return sendEmail({
        to: order.customerEmail,
        subject,
        html,
        templateName: template.name,
        attachments: [
            {
                filename: `conferma-ordine-${order.orderNumber}.pdf`,
                content: receiptPdf,
                contentType: 'application/pdf'
            }
        ]
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
    const siteUrl = getSiteUrl();

    // Genera URL tracking (esempio con BRT/Bartolini, modifica per il tuo corriere)
    const trackingUrl = `https://vas.brt.it/vas/sped_det_show.htm?bession=&bession_cl=&referer=sped_numspe_par.htm&Ession=&NumSped=${order.trackingNumber}`;

    const html = replacePlaceholders(template.body, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        trackingUrl,
        shippingAddress: order.shippingAddress,
        siteName: 'Il Desiderio di una Stella',
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
    const siteUrl = getSiteUrl();

    const html = replacePlaceholders(template.body, {
        siteName: 'Il Desiderio di una Stella',
        siteUrl,
        unsubscribeUrl: `${siteUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
    });

    const subject = replacePlaceholders(template.subject, {
        siteName: 'Il Desiderio di una Stella'
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
    const siteUrl = getSiteUrl();

    const html = replacePlaceholders(template.body, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        siteName: 'Il Desiderio di una Stella',
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
