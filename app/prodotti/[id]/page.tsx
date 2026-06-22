'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
<<<<<<< HEAD
import { Star, Heart, Share2, ShoppingCart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
import type { Product as CartProduct } from '@/types/product';
=======
import { Star, Heart, Share2, ShoppingCart, ChevronLeft, ChevronRight, Loader2, BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
>>>>>>> master

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
<<<<<<< HEAD
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
=======
}

export default function ProductDetailPage() {
    const { language, t } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
>>>>>>> master
    const [quantity, setQuantity] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const { addItem } = useCartStore();
<<<<<<< HEAD
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } =
        useWishlistStore();

    const isInWishlist = wishlistItems.some(item => item.id === product?.id);

    const productName =
        product?.translations?.name?.[language] || product?.name || '';

    const productDescription =
        product?.translations?.description?.[language] || product?.description || '';
=======
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

    const isInWishlist = wishlistItems.some(item => item.id === product?.id);

    // Ottieni nome e descrizione tradotti
    const productName = product?.translations?.name?.[language] || product?.name || '';
    const productDescription = product?.translations?.description?.[language] || product?.description || '';
>>>>>>> master

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
<<<<<<< HEAD
            console.error(error);
=======
            console.error('Auth check failed:', error);
>>>>>>> master
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/products/${params.id}`);
<<<<<<< HEAD
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
=======
            if (res.ok) {
                const data = await res.json();
                setProduct(data);

                // Fetch related products
                const relatedRes = await fetch(`/api/products/related?category=${data.category}&excludeId=${data.id}`);
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    setRelatedProducts(relatedData.slice(0, 4));
                }
            } else {
                toast.error('Prodotto non trovato');
                router.push('/prodotti');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
>>>>>>> master
            toast.error('Errore nel caricamento del prodotto');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
<<<<<<< HEAD
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
=======
        if (product && quantity > 0) {
            for (let i = 0; i < quantity; i++) {
                addItem(product);
            }
            toast.success(`${quantity} ${product.name} aggiunto al carrello!`);
        }
    };

    const handleWishlistToggle = () => {
        if (product) {
            if (isInWishlist) {
                removeFromWishlist(product.id);
                toast.success('Rimosso dai preferiti');
            } else {
                addToWishlist(product);
                toast.success('Aggiunto ai preferiti!');
            }
>>>>>>> master
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
<<<<<<< HEAD
            await navigator.share({
                title: productName,
                text: productDescription,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
=======
            try {
                await navigator.share({
                    title: product?.name,
                    text: product?.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Share canceled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
>>>>>>> master
            toast.success('Link copiato negli appunti!');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
<<<<<<< HEAD
            toast.error('Devi effettuare il login');
=======
            toast.error('Devi effettuare il login per lasciare una recensione');
>>>>>>> master
            router.push('/login');
            return;
        }

        if (!newReview.comment.trim()) {
<<<<<<< HEAD
            toast.error('Scrivi un commento');
=======
            toast.error('Scrivi un commento per la recensione');
>>>>>>> master
            return;
        }

        setSubmittingReview(true);
<<<<<<< HEAD

=======
>>>>>>> master
        try {
            const res = await fetch(`/api/products/${params.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
                body: JSON.stringify(newReview),
            });

            if (res.ok) {
                toast.success('Recensione aggiunta!');
                setNewReview({ rating: 5, comment: '' });
                fetchProduct();
            } else {
                toast.error('Errore nell’invio');
            }
=======
                body: JSON.stringify(newReview)
            });

            if (res.ok) {
                toast.success('Recensione aggiunta con successo!');
                setNewReview({ rating: 5, comment: '' });
                fetchProduct(); // Ricarica per mostrare la nuova recensione
            } else {
                const data = await res.json();
                toast.error(data.error || 'Errore nell\'aggiunta della recensione');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Errore nell\'invio della recensione');
>>>>>>> master
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
<<<<<<< HEAD
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin" />
=======
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--color-primary)' }} />
>>>>>>> master
            </div>
        );
    }

<<<<<<< HEAD
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
=======
    if (!product) {
        return null;
    }

    const images = product.image ? [product.image] : [];
    const averageRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return (
        <div className="min-h-screen py-8 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.06),transparent_30%),linear-gradient(180deg,#fff_0%,#faf7ff_36%,#fff_100%)]">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-6 md:mb-8">
                    <Link href="/" className="hover:underline" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Home</Link>
                    <span style={{ color: 'var(--color-text)', opacity: 0.5 }}>/</span>
                    <Link href="/prodotti" className="hover:underline" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Prodotti</Link>
                    <span style={{ color: 'var(--color-text)', opacity: 0.5 }}>/</span>
                    <Link href={`/prodotti?category=${product.category}`} className="hover:underline" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{product.category}</Link>
                    <span style={{ color: 'var(--color-text)', opacity: 0.5 }}>/</span>
                    <span style={{ color: 'var(--color-text)' }}>{productName}</span>
                </nav>

                <div className="mb-8 rounded-[1.75rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_45px_rgba(31,41,55,0.08)] p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">Dettaglio prodotto</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>{productName}</h1>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 font-semibold text-purple-700"><BadgeCheck className="w-4 h-4" /> Handmade</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Pagamenti sicuri</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-2 font-semibold text-yellow-700"><Truck className="w-4 h-4" /> Spedizione rapida</span>
                    </div>
                </div>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4 lg:sticky lg:top-6 self-start">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden group border border-white/70 shadow-[0_24px_70px_rgba(31,41,55,0.12)]" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : product.icon ? (
                                <div className="w-full h-full flex items-center justify-center text-9xl bg-linear-to-br from-purple-50 to-yellow-50">
                                    {product.icon}
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-linear-to-br from-purple-50 to-yellow-50">
                                    Nessuna immagine
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/35 via-black/10 to-transparent text-white">
                                <p className="text-sm font-medium">{product.category}</p>
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border transition ${selectedImage === index ? 'ring-2 ring-purple-500 border-purple-300' : 'border-gray-200'}`}
                                    >
                                        <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(31,41,55,0.08)] p-6 md:p-8 space-y-6">
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                                {product.category}
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3" style={{ color: 'var(--color-text)' }}>
                                {productName}
                            </h2>

                            {/* Rating */}
                            {product.reviews && product.reviews.length > 0 && (
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)', opacity: 0.75 }}>
                                        ({product.reviews.length} recensioni)
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[linear-gradient(135deg,rgba(147,51,234,0.08),rgba(253,224,71,0.14))] border border-purple-100">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Prezzo</p>
                                    <p className="text-3xl sm:text-4xl md:text-5xl font-black mt-1" style={{ color: 'var(--color-primary)' }}>
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {product.stock > 0 ? (
                                        <p className="text-emerald-600 font-semibold">✓ Disponibile</p>
                                    ) : (
                                        <p className="text-red-600 font-semibold">✗ Non disponibile</p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">{product.stock} in stock</p>
                                </div>
                            </div>

                            <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.82 }}>
                                {productDescription}
                            </p>

                            {/* Quantity Selector */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <label className="font-semibold" style={{ color: 'var(--color-text)' }}>Quantità:</label>
                            <div className="flex items-center border rounded-full overflow-hidden bg-white shadow-sm" style={{ borderColor: 'rgba(209,213,219,0.9)' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 text-center border-x py-2"
                                    min="1"
                                    max={product.stock}
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    +
                                </button>
                            </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="flex-1 py-4 px-6 rounded-full font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Aggiungi al Carrello</span>
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleWishlistToggle}
                                        className="p-4 rounded-full border-2 hover:bg-gray-50 transition shadow-sm"
                                        style={{ borderColor: 'var(--color-primary)' }}
                                    >
                                        <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} style={{ color: isInWishlist ? undefined : 'var(--color-primary)' }} />
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="p-4 rounded-full border-2 hover:bg-gray-50 transition shadow-sm"
                                        style={{ borderColor: 'var(--color-primary)' }}
                                    >
                                        <Share2 className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black mb-8" style={{ color: 'var(--color-text)' }}>
                        Recensioni
                    </h2>

                    {/* Add Review Form */}
                    {user && (
                        <form onSubmit={handleSubmitReview} className="mb-8 p-6 md:p-8 rounded-[1.75rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
                            <h3 className="text-xl font-black mb-4" style={{ color: 'var(--color-text)' }}>Lascia una recensione</h3>

                            <div className="mb-4">
                                <label className="block font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Valutazione</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Commento</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: 'var(--color-primary)' }}
                                    rows={4}
                                    placeholder="Condividi la tua esperienza con questo prodotto..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="px-6 py-3 rounded-full font-bold hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
                                {submittingReview ? 'Invio...' : 'Invia Recensione'}
                            </button>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review) => (
                                <div key={review.id} className="p-6 rounded-[1.5rem] border shadow-sm" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'rgba(229,231,235,0.9)' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-bold" style={{ color: 'var(--color-text)' }}>{review.userName}</p>
                                            <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                                {new Date(review.createdAt).toLocaleDateString('it-IT')}
                                            </p>
                                        </div>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--color-text)' }}>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                Nessuna recensione ancora. Sii il primo a recensire questo prodotto!
                            </p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
                            Prodotti Correlati
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/prodotti/${relatedProduct.id}`}
                                    className="group rounded-[1.5rem] overflow-hidden shadow-[0_18px_40px_rgba(31,41,55,0.08)] hover:shadow-[0_28px_65px_rgba(31,41,55,0.14)] transition"
                                    style={{ backgroundColor: 'var(--color-card-bg)' }}
                                >
                                    <div className="relative aspect-square">
                                        {relatedProduct.image ? (
                                            <Image
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition"
                                            />
                                        ) : relatedProduct.icon ? (
                                            <div className="w-full h-full flex items-center justify-center text-6xl bg-linear-to-br from-purple-50 to-yellow-50">
                                                {relatedProduct.icon}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                                            {relatedProduct.name}
                                        </h3>
                                        <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                            €{relatedProduct.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
>>>>>>> master
