'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getCurrency } from '@/lib/currency';

export default function LanguageSelector() {
    const { language, setLanguage, currency } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'it', name: 'Italiano', flag: 'IT', nativeName: 'Italiano', emoji: '🇮🇹' },
        { code: 'en', name: 'English', flag: 'GB', nativeName: 'English (UK)', emoji: '🇬🇧' },
        { code: 'us', name: 'English US', flag: 'US', nativeName: 'English (US)', emoji: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: 'FR', nativeName: 'Français', emoji: '🇫🇷' },
        { code: 'es', name: 'Español', flag: 'ES', nativeName: 'Español', emoji: '🇪🇸' },
        { code: 'de', name: 'Deutsch', flag: 'DE', nativeName: 'Deutsch', emoji: '🇩🇪' },
        { code: 'pt', name: 'Português', flag: 'PT', nativeName: 'Português', emoji: '🇵🇹' },
        { code: 'ru', name: 'Русский', flag: 'RU', nativeName: 'Русский', emoji: '🇷🇺' },
        { code: 'zh', name: '中文', flag: 'CN', nativeName: '中文', emoji: '🇨🇳' },
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode as any);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                title="Change Language"
            >
                <img
                    src={`https://flagcdn.com/24x18/${currentLang.flag.toLowerCase()}.png`}
                    alt={currentLang.nativeName}
                    className="w-6 h-auto rounded shadow-sm group-hover:scale-110 transition-transform duration-300"
                />
                <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">{currentLang.code}</span>
                <span className="hidden md:inline text-xs font-semibold opacity-75">({currency.symbol})</span>
            </button>

            {isOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 mt-3 w-[calc(100vw-1rem)] sm:w-64 max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100 animate-slideDown">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 sm:px-4 py-2 sm:py-3">
                        <h3 className="text-white font-bold text-xs sm:text-sm flex items-center space-x-2">
                            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Language & Currency</span>
                        </h3>
                    </div>

                    <div className="max-h-72 sm:max-h-96 overflow-y-auto">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 flex items-center justify-between group ${language === lang.code
                                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600'
                                    : 'border-l-4 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <img
                                        src={`https://flagcdn.com/48x36/${lang.flag.toLowerCase()}.png`}
                                        alt={lang.nativeName}
                                        className="w-6 h-5 sm:w-8 sm:h-6 rounded shadow-sm group-hover:scale-110 transition-transform duration-200"
                                    />
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-xs sm:text-sm ${language === lang.code ? 'text-purple-700' : 'text-gray-800'
                                            }`}>
                                            {lang.nativeName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {getCurrency(lang.code).code} ({getCurrency(lang.code).symbol})
                                        </span>
                                    </div>
                                </div>
                                {language === lang.code && (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 animate-scaleIn" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                            🌍 {languages.length} languages available
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
