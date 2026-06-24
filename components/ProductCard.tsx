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
            className="group overflow-hidden h-full flex flex-col lux-card hover:-translate-y-1.5 hover:shadow-[0_24px_54px_rgba(33,26,23,0.16)]"
            style={{
                backgroundColor: 'var(--color-card-bg)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px'
            }}
        >
            <Link href={`/prodotti/${product.id}`}>
                <div
                    className="relative h-52 sm:h-56 md:h-60 lg:h-52 xl:h-56 overflow-hidden"
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-70" />
                </div>
            </Link>

            <div className="p-3.5 sm:p-4.5 md:p-5 flex-1 flex flex-col">
                    <span className="lux-chip mb-2.5 w-fit">{t('handmadeLabel')}</span>
                <Link href={`/prodotti/${product.id}`}>
                    <h3
                        className="text-lg sm:text-xl font-bold line-clamp-1 hover:opacity-80 font-display"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {productName}
                    </h3>
                </Link>

                <p
                    className="text-xs sm:text-sm mt-1.5 line-clamp-1 flex-1"
                    style={{ color: 'var(--color-text)', opacity: 0.7 }}
                >
                    {productDescription}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <PriceWithTooltip
                        priceInEuro={product.price}
                        className="text-lg sm:text-xl font-bold"
                    />

                    <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        aria-label={added ? t('addedToCart') : t('addToCart')}
                        title={added ? t('addedToCart') : t('addToCart')}
                        className={`${added ? 'bg-green-600 scale-105' : ''} px-3 py-2 rounded-xl hover:scale-105 transition-all flex items-center justify-center disabled:bg-gray-400 shadow-lg`}
                        style={{
                            backgroundColor: added
                                ? '#16a34a'
                                : 'var(--color-primary)',
                            color: 'var(--color-button-text)'
                        }}
                    >
                        <ShoppingCart className="w-4 h-4" />
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
