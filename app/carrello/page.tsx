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
            <div className="container mx-auto px-4 py-20" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="text-center max-w-md mx-auto">
                    <ShoppingBag className="w-24 h-24 mx-auto mb-6" style={{ color: 'var(--color-border)' }} />
                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        {t('emptyCart')}
                    </h1>
                    <p className="mb-8" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        {t('emptyCartMessage')}
                    </p>
                    <Link
                        href="/prodotti"
                        className="px-8 py-3 rounded-lg hover:opacity-90 transition inline-block font-semibold"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        {t('continueShopping')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8" style={{ color: 'var(--color-text)' }}>Carrello</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista Prodotti */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="rounded-lg shadow-md p-4 sm:p-6" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-background)' }}>
                                        <span className="text-2xl sm:text-3xl">🔑</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base sm:text-lg" style={{ color: 'var(--color-text)' }}>
                                            {item.translations?.name?.[language] || item.name}
                                        </h3>
                                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>{formatPrice(item.price)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-2 hover:opacity-70"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 border-x" style={{ borderColor: 'var(--color-border)' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-2 hover:opacity-70"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 text-right font-semibold" style={{ color: 'var(--color-text)' }}>
                                Subtotale: {formatPrice(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Riepilogo Ordine */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-fit">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Riepilogo Ordine</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span>Subtotale</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Spedizione</span>
                            <span>{shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}</span>
                        </div>
                        {total < 30 && (
                            <p className="text-sm text-gray-600">
                                Spendi altri {formatPrice(30 - total)} per la spedizione gratuita!
                            </p>
                        )}
                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Totale</span>
                            <span>{formatPrice(total + shippingCost)}</span>
                        </div>
                    </div>

                    <Link href="/checkout">
                        <button className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}>
                            Procedi al Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
