'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import PriceWithTooltip from './PriceWithTooltip';
import { Product as BaseProduct } from '@/types/product';

/* 👇 ESTENSIONE LOCALE DEL TIPO */
type Product = BaseProduct & {
    translations?: {
        name?: Record<string, string>;
        description?: Record<string, string>;
    };
};

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { language, t } = useLanguage();
    const addItem = useCartStore(state => state.addItem);
    const [added, setAdded] = useState(false);

    // Nome e descrizione tradotti (safe)
    const productName =
        product.translations?.name?.[language] ?? product.name;

    const productDescription =
        product.translations?.description?.[language] ?? product.description;

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col"
            style={{
                backgroundColor: 'var(--color-card-bg)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px'
            }}
        >
            <Link href={`/prodotti/${product.id}`}>
                <div
                    className="relative h-64 sm:h-72 md:h-80 lg:h-64 xl:h-72 overflow-hidden"
                    style={{ backgroundColor: 'var(--color-background)' }}
                >
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0].url}
                            alt={productName}
                            fill
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-6xl">🔑</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                <Link href={`/prodotti/${product.id}`}>
                    <h3
                        className="text-lg sm:text-xl font-bold line-clamp-1 hover:opacity-80"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {productName}
                    </h3>
                </Link>

                <p
                    className="text-xs sm:text-sm mt-2 line-clamp-2 flex-1"
                    style={{ color: 'var(--color-text)', opacity: 0.7 }}
                >
                    {productDescription}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <PriceWithTooltip
                        priceInEuro={product.price}
                        className="text-xl sm:text-2xl font-bold"
                    />

                    <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`${
                            added ? 'bg-green-600 scale-105' : ''
                        } px-3 py-2 rounded-xl hover:scale-105 transition-all flex items-center gap-2 disabled:bg-gray-400`}
                        style={{
                            backgroundColor: added
                                ? '#16a34a'
                                : 'var(--color-primary)',
                            color: 'var(--color-button-text)'
                        }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">
                            {added
                                ? t('addedToCart')
                                : t('addToCart')}
                        </span>
                        <span className="sm:hidden">
                            {added ? '✓' : '+'}
                        </span>
                    </button>
                </div>

                {!product.inStock && (
                    <div className="mt-3 text-xs text-red-500 font-bold bg-red-50 py-1.5 px-3 rounded-lg text-center">
                        {t('outOfStock')}
                    </div>
                )}
            </div>
        </div>
    );
}