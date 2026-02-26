'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { Star, Heart, Share2, ShoppingCart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
import type { Product as CartProduct } from '@/types/product';

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    icon?: string;
    stock: number;
    reviews?: Review[];
    translations?: {
        name?: Record<string, string>;
        description?: Record<string, string>;
    };
}

export default function ProductDetailPage() {
    const { language } = useLanguage();
    const params = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const { addItem } = useCartStore();
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } =
        useWishlistStore();

    const isInWishlist = wishlistItems.some(item => item.id === product?.id);

    const productName =
        product?.translations?.name?.[language] || product?.name || '';

    const productDescription =
        product?.translations?.description?.[language] || product?.description || '';

    useEffect(() => {
        fetchProduct();
        checkAuth();
    }, [params.id]);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/products/${params.id}`);
            if (!res.ok) {
                toast.error('Prodotto non trovato');
                router.push('/prodotti');
                return;
            }

            const data = await res.json();
            setProduct(data);

            const relatedRes = await fetch(
                `/api/products/related?category=${data.category}&excludeId=${data.id}`
            );

            if (relatedRes.ok) {
                const relatedData = await relatedRes.json();
                setRelatedProducts(relatedData.slice(0, 4));
            }
        } catch (error) {
            toast.error('Errore nel caricamento del prodotto');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product || quantity <= 0) return;

        const productForCart: CartProduct = {
            id: product.id.toString(),
            name: productName,
            description: productDescription,
            price: product.price,
            category: product.category,
            images: product.image ? [{ url: product.image, alt: productName }] : [],
            inStock: product.stock > 0,
        };

        for (let i = 0; i < quantity; i++) {
            addItem(productForCart);
        }

        toast.success(`${quantity} ${productName} aggiunto al carrello!`);
    };

    const handleWishlistToggle = () => {
        if (!product) return;

        if (isInWishlist) {
            removeFromWishlist(product.id);
            toast.success('Rimosso dai preferiti');
        } else {
            addToWishlist(product);
            toast.success('Aggiunto ai preferiti!');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: productName,
                text: productDescription,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copiato negli appunti!');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Devi effettuare il login');
            router.push('/login');
            return;
        }

        if (!newReview.comment.trim()) {
            toast.error('Scrivi un commento');
            return;
        }

        setSubmittingReview(true);

        try {
            const res = await fetch(`/api/products/${params.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview),
            });

            if (res.ok) {
                toast.success('Recensione aggiunta!');
                setNewReview({ rating: 5, comment: '' });
                fetchProduct();
            } else {
                toast.error('Errore nell’invio');
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    if (!product) return null;

    const averageRating =
        product.reviews && product.reviews.length > 0
            ? product.reviews.reduce((s, r) => s + r.rating, 0) /
              product.reviews.length
            : 0;

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4">{productName}</h1>

                <p className="text-2xl font-bold mb-4">
                    €{product.price.toFixed(2)}
                </p>

                <p className="mb-6">{productDescription}</p>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="px-6 py-3 bg-black text-white rounded"
                >
                    <ShoppingCart className="inline mr-2" />
                    Aggiungi al carrello
                </button>

                <button
                    onClick={handleWishlistToggle}
                    className="ml-4 px-4 py-3 border rounded"
                >
                    <Heart
                        className={isInWishlist ? 'fill-red-500 text-red-500' : ''}
                    />
                </button>

                <button
                    onClick={handleShare}
                    className="ml-4 px-4 py-3 border rounded"
                >
                    <Share2 />
                </button>
            </div>
        </div>
    );
}