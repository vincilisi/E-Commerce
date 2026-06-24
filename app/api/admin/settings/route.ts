export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        return NextResponse.json({ settings });
    } catch {
        return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            siteName,
            contactEmail,
            contactPhone,
            contactWhatsapp,
            primaryColor,
            secondaryColor,
            accentColor,
            backgroundColor,
            textColor,
            cardBackground,
            borderColor,
            buttonTextColor,
            fontFamily,
            customFontUrl,
            logo,
            // Search Bar
            searchBgColor,
            searchTextColor,
            searchPlaceholder,
            searchBorderColor,
            searchIconColor,
            // Virtual Assistant
            assistantEnabled,
            assistantName,
            assistantColor,
            assistantTextColor,
            assistantWelcome,
            assistantPosition
        } = body;

        // Trova o crea le impostazioni
        const existing = await prisma.siteSettings.findFirst();

        const data = {
            siteName,
            contactEmail,
            contactPhone,
            contactWhatsapp,
            primaryColor,
            secondaryColor,
            accentColor,
            backgroundColor,
            textColor,
            cardBackground,
            borderColor,
            buttonTextColor,
            fontFamily,
            customFontUrl,
            logo,
            searchBgColor,
            searchTextColor,
            searchPlaceholder,
            searchBorderColor,
            searchIconColor,
            assistantEnabled,
            assistantName,
            assistantColor,
            assistantTextColor,
            assistantWelcome,
            assistantPosition
        };

        // Rimuovi valori undefined
        Object.keys(data).forEach(key => {
            if (data[key as keyof typeof data] === undefined) {
                delete data[key as keyof typeof data];
            }
        });

        let settings;
        try {
            if (existing) {
                settings = await prisma.siteSettings.update({
                    where: { id: existing.id },
                    data
                });
            } else {
                settings = await prisma.siteSettings.create({
                    data
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : '';
            const whatsappNotSupported =
                message.includes('contactWhatsapp') ||
                message.includes('Unknown argument') ||
                message.includes('no such column');

            if (!whatsappNotSupported) {
                throw err;
            }

            const fallbackData = { ...data };
            delete fallbackData.contactWhatsapp;

            if (existing) {
                settings = await prisma.siteSettings.update({
                    where: { id: existing.id },
                    data: fallbackData
                });
            } else {
                settings = await prisma.siteSettings.create({
                    data: fallbackData
                });
            }
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        const details = error instanceof Error ? error.message : 'Errore sconosciuto';
        return NextResponse.json(
            {
                error: 'Errore nell\'aggiornamento',
                details: process.env.NODE_ENV === 'production' ? undefined : details
            },
            { status: 500 }
        );
    }
}
