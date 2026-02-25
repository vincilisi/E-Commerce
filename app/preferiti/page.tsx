'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleAddAllToCart = () => {
        items.forEach(item => addItem(item));
        toast.success(`${items.length} prodotti aggiunti al carrello!`);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="text-center">
                    <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                    <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Nessun Prodotto nei Preferiti
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Inizia ad aggiungere prodotti ai tuoi preferiti per trovarli facilmente in seguito!
                    </p>
                    <Link
                        href="/prodotti"
                        className="px-8 py-4 rounded-lg font-bold hover:opacity-90 transition inline-block"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        Scopri i Prodotti
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                            I Miei Preferiti
                        </h1>
                        <span className="text-xl text-gray-500">({items.length})</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                            onClick={handleAddAllToCart}
                            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold sm:font-bold hover:opacity-90 transition text-sm sm:text-base"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                        >
                            Aggiungi Tutti al Carrello
                        </button>
                        <button
                            onClick={clearWishlist}
                            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold sm:font-bold border-2 hover:bg-gray-50 transition text-sm sm:text-base"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                        >
                            Svuota Preferiti
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group"
                            style={{ backgroundColor: 'var(--color-card-bg)' }}
                        >
                            <Link href={`/prodotti/${item.id}`} className="block">
                                <div className="relative aspect-square">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition"
                                        />
                                    ) : item.icon ? (
                                        <div className="w-full h-full flex items-center justify-center text-7xl">
                                            {item.icon}
                                        </div>
                                    ) : null}
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link href={`/prodotti/${item.id}`}>
                                    <h3 className="font-bold mb-2 hover:opacity-70 transition" style={{ color: 'var(--color-text)' }}>
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                                    €{item.price.toFixed(2)}
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            addItem(item);
                                            toast.success('Aggiunto al carrello!');
                                        }}
                                        className="flex-1 py-2 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center space-x-2"
                                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span className="text-sm">Carrello</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            removeItem(item.id);
                                            toast.success('Rimosso dai preferiti');
                                        }}
                                        className="p-2 rounded-lg border-2 hover:bg-gray-50 transition"
                                        style={{ borderColor: 'var(--color-primary)' }}
                                    >
                                        <Trash2 className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
