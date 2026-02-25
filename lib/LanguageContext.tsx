'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';
import { formatPrice, getCurrency, Currency, updateExchangeRates, getLastUpdate } from './currency';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    formatPrice: (priceInEuro: number) => string;
    currency: Currency;
    lastRatesUpdate: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('it');
    const [lastRatesUpdate, setLastRatesUpdate] = useState<string>('');

    useEffect(() => {
        // Carica la lingua salvata dal localStorage
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && translations[savedLanguage]) {
            setLanguageState(savedLanguage);
        } else {
            // Rileva la lingua del browser
            const browserLang = navigator.language.split('-')[0] as Language;
            if (translations[browserLang]) {
                setLanguageState(browserLang);
            }
        }

        // Carica i tassi di cambio al mount
        updateExchangeRates().then(() => {
            setLastRatesUpdate(getLastUpdate());
        });

        // Aggiorna i tassi ogni ora
        const interval = setInterval(() => {
            updateExchangeRates().then(() => {
                setLastRatesUpdate(getLastUpdate());
            });
        }, 3600000); // 1 ora

        return () => clearInterval(interval);
    }, []);

    const setLanguage = (lang: Language) => {
        console.log('🌍 Cambio lingua da', language, 'a', lang);
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        // Forza il refresh della pagina per applicare tutte le traduzioni
        window.location.reload();
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    const formatPriceWithCurrency = (priceInEuro: number): string => {
        return formatPrice(priceInEuro, language);
    };

    const currency = getCurrency(language);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice: formatPriceWithCurrency, currency, lastRatesUpdate }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
