'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { Coins } from 'lucide-react';

export default function CurrencyIndicator() {
    const { currency } = useLanguage();

    return (
        <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm">
            <Coins className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-xs font-bold text-white">{currency.code}</span>
        </div>
    );
}
