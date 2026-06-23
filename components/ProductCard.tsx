'use client';

import Image from 'next/image';
import Link from 'next/link';
<<<<<<< HEAD
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
=======
import { Product } from '@/types/product';
import { ShoppingCart, BadgeCheck, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import PriceWithTooltip from './PriceWithTooltip';
>>>>>>> master

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
<<<<<<< HEAD
    const { language, t } = useLanguage();
    const addItem = useCartStore(state => state.addItem);
    const [added, setAdded] = useState(false);

    // Nome e descrizione tradotti (safe)
    const productName =
        product.translations?.name?.[language] ?? product.name;

    const productDescription =
        product.translations?.description?.[language] ?? product.description;
=======
    const { language, t, formatPrice } = useLanguage();
    const addItem = useCartStore(state => state.addItem);
    const { items: wishlistItems, toggleWishlist } = useWishlistStore();
    const [added, setAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(
        wishlistItems.some(item => item.id === product.id)
    );

    // Ottieni nome e descrizione tradotti se disponibili
    const productName = product.translations?.name?.[language] || product.name;
    const productDescription = product.translations?.description?.[language] || product.description;
    const firstMaterial = product.materials?.[0]?.name;
>>>>>>> master

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

<<<<<<< HEAD
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
=======
    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleWishlist(product);
        setIsWishlisted(!isWishlisted);
    };
    return (
        <div className="group relative overflow-hidden rounded-3xl h-full flex flex-col animate-fadeIn" style={{ animationDelay: '50ms' }}>
            {/* Luxury gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-white via-purple-50/40 to-indigo-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
            
            {/* Card container with premium shadow */}
            <div className="relative z-10 h-full flex flex-col rounded-3xl overflow-hidden bg-white/98 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(147,51,234,0.08)] group-hover:shadow-[0_24px_64px_rgba(147,51,234,0.16)] transition-all duration-500">
                
                {/* Image Section */}
                <Link href={`/prodotti/${product.id}`}>
                    <div className="relative h-72 sm:h-80 md:h-72 lg:h-80 overflow-hidden bg-linear-to-br from-slate-100 via-purple-50 to-indigo-50">
                        {product.images && product.images.length > 0 ? (
                            <Image
                                src={product.images[0].url}
                                alt={productName}
                                fill
                                className="object-cover w-full h-full group-hover:scale-[1.08] transition-transform duration-700 ease-premium"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority={false}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-7xl sm:text-8xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500">🔑</span>
                            </div>
                        )}

                        {/* Luxury overlay on hover */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-20">
                            <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-bold shadow-lg border border-white/50">
                                <BadgeCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                <span>Artigianale</span>
                            </div>
                            
                            {product.inStock ? (
                                <div className="rounded-full bg-emerald-500/95 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg border border-emerald-400/50">
                                    ✓ Disponibile
                                </div>
                            ) : (
                                <div className="rounded-full bg-red-500/95 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg border border-red-400/50">
                                    Esaurito
                                </div>
                            )}
                        </div>

                        {/* Wishlist button */}
                        <button
                            onClick={handleWishlistToggle}
                            className="absolute bottom-4 right-4 p-3 rounded-full bg-white/92 backdrop-blur-md border border-white/70 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-20"
                        >
                            <Heart
                                className="w-5 h-5 transition-all duration-300"
                                style={{
                                    color: isWishlisted ? 'var(--color-primary)' : '#9ca3af',
                                    fill: isWishlisted ? 'var(--color-primary)' : 'none'
                                }}
                            />
                        </button>

                        {/* Hover CTA */}
                        <div className="absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-gray-900 shadow-lg border border-white/50 hover:bg-white cursor-pointer">
                                Scopri →
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col bg-linear-to-b from-white/98 via-white/95 to-purple-50/30">
                    
                    {/* Category & Material badges */}
                    <div className="mb-3 flex flex-wrap justify-center gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-purple-100/80 text-purple-700 text-[10px] font-bold px-3 py-1.5 border border-purple-200/60">
                            {product.category}
                        </span>
                        {firstMaterial && (
                            <span className="inline-flex items-center rounded-full bg-amber-100/80 text-amber-700 text-[10px] font-bold px-3 py-1.5 border border-amber-200/60">
                                {firstMaterial}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 text-indigo-700 text-[10px] font-bold px-3 py-1.5 border border-indigo-200/60">
                            <Sparkles className="w-3 h-3" />
                            Premium
                        </span>
                    </div>

                    {/* Product name */}
                    <Link href={`/prodotti/${product.id}`}>
                        <h3 className="text-lg sm:text-xl font-black leading-tight group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 text-center" style={{ color: 'var(--color-text)' }}>
                            {productName}
                        </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs sm:text-sm mt-2.5 line-clamp-2 leading-relaxed flex-1 text-center opacity-70 group-hover:opacity-85 transition-opacity" style={{ color: 'var(--color-text)' }}>
                        {productDescription}
                    </p>

                    {/* Divider */}
                    <div className="mt-4 mb-4 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

                    {/* Price & Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Prezzo</p>
                            <div className="inline-block sm:block">
                                <PriceWithTooltip
                                    priceInEuro={product.price}
                                    className="text-2xl sm:text-3xl font-black bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 inline-flex items-center justify-center border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group/btn"
                            style={{
                                backgroundColor: added ? '#16a34a' : 'var(--color-primary)',
                                color: 'var(--color-button-text)'
                            }}
                            title={added ? '✓ Aggiunto!' : t('addToCart')}
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            <ShoppingCart className="w-5 h-5 relative z-10" />
                        </button>
                    </div>

                    {!product.inStock && (
                        <div className="mt-3 text-xs text-center font-bold text-red-600 bg-red-50 py-2.5 px-3 rounded-full border border-red-200">
                            {t('outOfStock')}
                        </div>
                    )}

                    {/* Trust indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-center gap-1.5">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xs">★</span>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">Scelto da 500+ clienti</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
>>>>>>> master
