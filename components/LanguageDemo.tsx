'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageDemo() {
    const { language, t } = useLanguage();

    const examples = [
        { key: 'home', label: 'Home' },
        { key: 'products', label: 'Products' },
        { key: 'cart', label: 'Cart' },
        { key: 'checkout', label: 'Checkout' },
        { key: 'addToCart', label: 'Add to Cart' },
        { key: 'total', label: 'Total' },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Translation Examples (Current: {language.toUpperCase()})</h3>
            <div className="grid grid-cols-2 gap-4">
                {examples.map((example) => (
                    <div key={example.key} className="border-b pb-2">
                        <span className="text-gray-500 text-sm">{example.label}:</span>
                        <p className="font-semibold">{t(example.key)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
