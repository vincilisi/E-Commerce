import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            siteName,
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

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Errore nell\'aggiornamento' }, { status: 500 });
    }
}
