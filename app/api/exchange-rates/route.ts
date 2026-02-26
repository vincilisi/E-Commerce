export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

// Cache per i tassi di cambio (valido per 1 ora)
let cachedRates: any = null;
let lastUpdate: number = 0;
const CACHE_DURATION = 3600000; // 1 ora in millisecondi

export async function GET() {
    try {
        const now = Date.now();

        // Usa cache se ancora valida
        if (cachedRates && (now - lastUpdate) < CACHE_DURATION) {
            return NextResponse.json({
                rates: cachedRates,
                lastUpdate: new Date(lastUpdate).toISOString(),
                cached: true
            });
        }

        // Chiama API gratuita di exchangerate-api.com (non richiede key per base EUR)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();

        // Estrai solo le valute che ci interessano
        const relevantRates = {
            EUR: 1,
            GBP: data.rates.GBP,
            RUB: data.rates.RUB,
            CNY: data.rates.CNY,
            USD: data.rates.USD, // Aggiungiamo anche USD
        };

        // Aggiorna cache
        cachedRates = relevantRates;
        lastUpdate = now;

        return NextResponse.json({
            rates: relevantRates,
            lastUpdate: new Date(lastUpdate).toISOString(),
            cached: false
        });
    } catch (error) {
        console.error('Error fetching exchange rates:', error);

        // Fallback ai tassi fissi se l'API fallisce
        return NextResponse.json({
            rates: {
                EUR: 1,
                GBP: 0.86,
                RUB: 105,
                CNY: 7.85,
                USD: 1.09,
            },
            lastUpdate: new Date().toISOString(),
            cached: false,
            fallback: true,
            error: 'Using fallback rates'
        });
    }
}
