'use client';

import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';

export default function CarrelloPage() {
    const { language, t, formatPrice } = useLanguage();
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const shippingCost = getTotalPrice() >= 30 ? 0 : 5;
    const total = getTotalPrice();

    if (items.length === 0) {
        return (
            <div className="page-shell container mx-auto px-4 py-20">
                <div className="empty-state-panel text-center max-w-xl mx-auto px-8 py-10">
                    <ShoppingBag className="w-24 h-24 mx-auto mb-6" style={{ color: 'var(--color-border)' }} />
                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        {t('emptyCart')}
                    </h1>
                    <p className="mb-8" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        {t('emptyCartMessage')}
                    </p>
                    <Link
                        href="/prodotti"
                        className="btn-lux-primary inline-flex font-semibold"
                    >
                        {t('continueShopping')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell container mx-auto px-4 py-12">
            <section className="hero-shell px-6 py-8 sm:px-8 md:px-10 md:py-10 mb-8 md:mb-10">
                <p className="eyebrow mb-3">Shopping bag curata</p>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold title-balance" style={{ color: 'var(--color-text)' }}>Carrello essenziale, leggibile e pronto al checkout.</h1>
                        <p className="mt-4 text-base md:text-lg" style={{ color: 'var(--color-text)', opacity: 0.74 }}>Controlla quantità, spedizione e totale in un colpo d'occhio senza attriti inutili.</p>
                    </div>
                    <div className="stat-pill">{items.length} {items.length === 1 ? t('item') : t('items')}</div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista Prodotti */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="surface-panel p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                                        <span className="text-2xl sm:text-3xl">🔑</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base sm:text-lg" style={{ color: 'var(--color-text)' }}>
                                            {(item as any).translations?.name?.[language] || item.name}
                                        </h3>
                                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>{formatPrice(item.price)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center rounded-full border px-1.5 py-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(255,255,255,0.82)' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="icon-action w-9 h-9 shadow-none border-0 bg-transparent"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 font-semibold" style={{ color: 'var(--color-text)' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="icon-action w-9 h-9 shadow-none border-0 bg-transparent"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="icon-action text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 text-right font-semibold" style={{ color: 'var(--color-text)' }}>
                                Subtotale: {formatPrice(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Riepilogo Ordine */}
                <div className="surface-panel p-4 sm:p-6 h-fit sticky top-24">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--color-text)' }}>Riepilogo Ordine</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between" style={{ color: 'var(--color-text)', opacity: 0.76 }}>
                            <span>Subtotale</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between" style={{ color: 'var(--color-text)', opacity: 0.76 }}>
                            <span>Spedizione</span>
                            <span>{shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}</span>
                        </div>
                        {total < 30 && (
                            <p className="text-sm text-gray-600">
                                Spendi altri {formatPrice(30 - total)} per la spedizione gratuita!
                            </p>
                        )}
                        <div className="border-t pt-3 flex justify-between font-bold text-lg" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                            <span>Totale</span>
                            <span>{formatPrice(total + shippingCost)}</span>
                        </div>
                    </div>

                    <Link href="/checkout">
                        <button className="btn-lux-primary w-full py-3 font-semibold">
                            Procedi al Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
