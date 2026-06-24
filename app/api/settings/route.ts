export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        return NextResponse.json(
            { settings },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
    } catch {
        return NextResponse.json(
            {
                settings: {
                    siteName: 'Il Desiderio di una Stella',
                    logo: '',
                    contactEmail: 'info@ildesideriodiunastella.it',
                    contactPhone: '+39 123 456 7890',
                    contactWhatsapp: '+39 123 456 7890'
                }
            },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
    }
}
