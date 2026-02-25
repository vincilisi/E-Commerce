'use client';

import { useState } from 'react';
import { autoTranslateProduct } from '@/lib/autoTranslate';
import { Globe } from 'lucide-react';

interface TranslationPreviewProps {
    name: string;
    description: string;
}

export default function TranslationPreview({ name, description }: TranslationPreviewProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [translations, setTranslations] = useState<any>(null);

    const generatePreview = () => {
        if (name && description) {
            const result = autoTranslateProduct(name, description);
            setTranslations(result);
            setShowPreview(true);
        }
    };

    const languages = [
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
    ];

    return (
        <div className="mt-6">
            <button
                type="button"
                onClick={generatePreview}
                disabled={!name || !description}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <Globe className="w-5 h-5" />
                <span>Anteprima Traduzioni</span>
            </button>

            {showPreview && translations && (
                <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-purple-600" />
                        Traduzioni Automatiche Generate
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {languages.map((lang) => (
                            <div key={lang.code} className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">{lang.flag}</span>
                                    <span className="font-semibold text-gray-700">{lang.name}</span>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Nome:</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {translations.name[lang.code as keyof typeof translations.name]}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Descrizione:</p>
                                        <p className="text-sm text-gray-700 line-clamp-2">
                                            {translations.description[lang.code as keyof typeof translations.description]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                            💡 <strong>Nota:</strong> Le traduzioni si basano su un dizionario interno.
                            Parole non presenti nel dizionario rimarranno in italiano.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
