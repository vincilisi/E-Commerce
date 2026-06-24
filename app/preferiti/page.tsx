'use client';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';

import type { WishlistItem } from '@/lib/store/wishlistStore';
import type { Product } from '@/types/product';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

function wishlistToProduct(item: WishlistItem): Product {
  return {
    id: String(item.id),
    name: item.name,
    price: item.price,
    images: item.image
      ? [{ url: item.image, alt: item.name }]
      : [],
    category: 'wishlist',
    inStock: true,
    description: item.description,
  };
}

  const handleAddAllToCart = () => {
    items.forEach(item => addItem(wishlistToProduct(item)));
    toast.success(`${items.length} prodotti aggiunti al carrello!`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">
            Nessun Prodotto nei Preferiti
          </h2>
          <p className="text-gray-600 mb-8">
            Inizia ad aggiungere prodotti ai tuoi preferiti!
          </p>
          <Link
            href="/prodotti"
            className="px-8 py-4 rounded-lg font-bold"
          >
            Scopri i Prodotti
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-3xl font-bold">I Miei Preferiti</h1>
            <span className="text-xl text-gray-500">({items.length})</span>
          </div>

          <div className="flex gap-4">
            <button onClick={handleAddAllToCart}>
              Aggiungi Tutti al Carrello
            </button>
            <button onClick={clearWishlist}>
              Svuota Preferiti
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="rounded shadow">
              <Link href={`/prodotti/${item.id}`}>
                <div className="relative aspect-square">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </Link>

              <div className="p-4">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xl font-bold">â‚¬{item.price.toFixed(2)}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      addItem(wishlistToProduct(item));
                      toast.success('Aggiunto al carrello!');
                    }}
                  >
                    <ShoppingCart />
                  </button>

                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success('Rimosso dai preferiti');
                    }}
                  >
                    <Trash2 />
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
