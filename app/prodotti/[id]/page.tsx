'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { Star, Heart, Share2, ShoppingCart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';

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
}

export default function ProductDetailPage() {
    const { language, t } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const { addItem } = useCartStore();
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

    const isInWishlist = wishlistItems.some(item => item.id === product?.id);

    // Ottieni nome e descrizione tradotti
    const productName = product?.translations?.name?.[language] || product?.name || '';
    const productDescription = product?.translations?.description?.[language] || product?.description || '';

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
            console.error('Auth check failed:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/products/${params.id}`);
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
            toast.error('Errore nel caricamento del prodotto');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
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
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
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
            toast.success('Link copiato negli appunti!');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Devi effettuare il login per lasciare una recensione');
            router.push('/login');
            return;
        }

        if (!newReview.comment.trim()) {
            toast.error('Scrivi un commento per la recensione');
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await fetch(`/api/products/${params.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const images = product.image ? [product.image] : [];
    const averageRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm mb-6 md:mb-8">
                    <Link href="/" className="hover:underline" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Home</Link>
                    <span style={{ color: 'var(--color-text)', opacity: 0.5 }}>/</span>
                    <Link href="/prodotti" className="hover:underline" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Prodotti</Link>
                    <span style={{ color: 'var(--color-text)', opacity: 0.5 }}>/</span>
                    <Link href={`/prodotti?category=${product.category}`} className="hover:underline" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{product.category}</Link>
                    <span style={{ color: 'var(--color-text)', opacity: 0.5 }}>/</span>
                    <span style={{ color: 'var(--color-text)' }}>{productName}</span>
                </nav>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-lg overflow-hidden group" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : product.icon ? (
                                <div className="w-full h-full flex items-center justify-center text-9xl">
                                    {product.icon}
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Nessuna immagine
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                                {product.category}
                            </p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                {productName}
                            </h1>

                            {/* Rating */}
                            {product.reviews && product.reviews.length > 0 && (
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                        ({product.reviews.length} recensioni)
                                    </span>
                                </div>
                            )}

                            <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                            {productDescription}
                        </p>

                        {/* Stock */}
                        <div>
                            {product.stock > 0 ? (
                                <p className="text-green-600 font-semibold">✓ Disponibile ({product.stock} in stock)</p>
                            ) : (
                                <p className="text-red-600 font-semibold">✗ Non disponibile</p>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <label className="font-semibold" style={{ color: 'var(--color-text)' }}>Quantità:</label>
                            <div className="flex items-center border rounded-lg">
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
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 py-4 px-6 rounded-lg font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Aggiungi al Carrello</span>
                            </button>

                            <button
                                onClick={handleWishlistToggle}
                                className="p-4 rounded-lg border-2 hover:bg-gray-50 transition"
                                style={{ borderColor: 'var(--color-primary)' }}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} style={{ color: isInWishlist ? undefined : 'var(--color-primary)' }} />
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-4 rounded-lg border-2 hover:bg-gray-50 transition"
                                style={{ borderColor: 'var(--color-primary)' }}
                            >
                                <Share2 className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
                        Recensioni
                    </h2>

                    {/* Add Review Form */}
                    {user && (
                        <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Lascia una recensione</h3>

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
                                className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
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
                                <div key={review.id} className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-card-bg)' }}>
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
                                    className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
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
                                            <div className="w-full h-full flex items-center justify-center text-6xl">
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
