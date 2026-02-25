export type Currency = {
    code: string;
    symbol: string;
    name: string;
    rate: number; // Tasso di cambio rispetto all'Euro
};

// Tassi di cambio in tempo reale (aggiornati dall'API)
let liveRates: Record<string, number> = {
    EUR: 1,
    GBP: 0.86,
    RUB: 105,
    CNY: 7.85,
    USD: 1.09,
};

let lastRatesUpdate: string = '';

export const currencies: Record<string, Omit<Currency, 'rate'>> = {
    it: { code: 'EUR', symbol: '€', name: 'Euro' },
    en: { code: 'GBP', symbol: '£', name: 'British Pound' },
    fr: { code: 'EUR', symbol: '€', name: 'Euro' },
    es: { code: 'EUR', symbol: '€', name: 'Euro' },
    de: { code: 'EUR', symbol: '€', name: 'Euro' },
    pt: { code: 'EUR', symbol: '€', name: 'Euro' },
    us: { code: 'USD', symbol: '$', name: 'US Dollar' },
    ru: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    zh: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
};

// Funzione per aggiornare i tassi dall'API
export async function updateExchangeRates() {
    try {
        const response = await fetch('/api/exchange-rates');
        const data = await response.json();

        if (data.rates) {
            liveRates = data.rates;
            lastRatesUpdate = data.lastUpdate;
        }
    } catch (error) {
        console.error('Failed to update exchange rates:', error);
    }
}

export function getLastUpdate(): string {
    return lastRatesUpdate;
}

export function convertPrice(priceInEuro: number, language: string): number {
    const currencyInfo = currencies[language] || currencies.it;
    const rate = liveRates[currencyInfo.code] || 1;
    return priceInEuro * rate;
}

export function formatPrice(priceInEuro: number, language: string): string {
    const currencyInfo = currencies[language] || currencies.it;
    const rate = liveRates[currencyInfo.code] || 1;
    const convertedPrice = priceInEuro * rate;

    // Formattazione con 2 decimali
    const formatted = convertedPrice.toFixed(2);

    // Posiziona il simbolo in base alla valuta
    if (currencyInfo.code === 'EUR' || currencyInfo.code === 'GBP') {
        return `${currencyInfo.symbol}${formatted}`;
    } else {
        return `${formatted} ${currencyInfo.symbol}`;
    }
}

export function getCurrency(language: string): Currency {
    const currencyInfo = currencies[language] || currencies.it;
    const rate = liveRates[currencyInfo.code] || 1;
    return {
        ...currencyInfo,
        rate
    };
}
