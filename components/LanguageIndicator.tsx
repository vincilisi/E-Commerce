'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageIndicator() {
    const { language } = useLanguage();

    const languages: Record<string, { flag: string; name: string }> = {
        it: { flag: 'IT', name: 'Italiano' },
        en: { flag: 'GB', name: 'English' },
        fr: { flag: 'FR', name: 'Français' },
        es: { flag: 'ES', name: 'Español' },
        de: { flag: 'DE', name: 'Deutsch' },
        pt: { flag: 'PT', name: 'Português' },
        ru: { flag: 'RU', name: 'Русский' },
        zh: { flag: 'CN', name: '中文' },
    };

    const currentLang = languages[language] || languages.it;

    return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">

            <img
                src={`https://flagcdn.com/24x18/${currentLang.flag.toLowerCase()}.png`}
                alt={currentLang.name}
                className="w-5 h-auto rounded shadow-sm"
            />
            <span className="text-sm font-medium opacity-90">{currentLang.name}</span>
        </div>
    );
}
