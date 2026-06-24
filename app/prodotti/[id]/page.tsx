'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { Star, Share2, ShoppingCart, Loader2, ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
import type { Product as CartProduct } from '@/types/product';
import ProductCard from '@/components/ProductCard';

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ProductDetail {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: Array<{ id?: string; url: string }>;
    materials?: Array<{ id: string; name: string }>;
    tags?: Array<{ id: string; name: string }>;
    dimensions?: string;
    inStock: boolean;
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

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const { addItem } = useCartStore();

    const productName =
        product?.translations?.name?.[language] || product?.name || '';

    const productDescription =
        product?.translations?.description?.[language] || product?.description || '';

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchProduct = useCallback(async () => {
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
                setRelatedProducts(Array.isArray(relatedData) ? relatedData.slice(0, 4) : []);
            }
        } catch {
            toast.error('Errore nel caricamento del prodotto');
        } finally {
            setLoading(false);
        }
    }, [params.id, router]);

    useEffect(() => {
        fetchProduct();
        checkAuth();
        setSelectedImage(0);
    }, [checkAuth, fetchProduct]);

    const handleAddToCart = () => {
        if (!product || quantity <= 0) return;

        const productForCart: CartProduct = {
            id: product.id,
            name: productName,
            description: productDescription,
            price: product.price,
            category: product.category,
            images: product.images?.map((img) => ({ url: img.url, alt: productName })) || [],
            inStock: product.inStock && product.stock > 0,
            materials: product.materials,
            tags: product.tags,
            dimensions: product.dimensions,
        };

        for (let i = 0; i < quantity; i++) {
            addItem(productForCart);
        }

        toast.success(`${quantity} ${productName} aggiunto al carrello!`);
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
        } catch {
            toast.error('Errore nell’invio');
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderStars = (rating: number, size = 'w-4 h-4') => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${size} ${star <= rating ? 'fill-[#f2c96b] text-[#f2c96b]' : 'text-[#d6c0a7]'}`}
                />
            ))}
        </div>
    );

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

    const gallery = product.images?.length ? product.images : [];
    const selectedImageUrl = gallery[selectedImage]?.url;

    return (
        <div className="min-h-screen py-8 md:py-12 lux-shell">
            <div className="container mx-auto px-4">
                <div className="text-sm text-[#7b6152] mb-6">
                    <Link href="/" className="hover:text-[#a53b2f]">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/prodotti" className="hover:text-[#a53b2f]">Prodotti</Link>
                    <span className="mx-2">/</span>
                    <span>{productName}</span>
                </div>

                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 xl:gap-10 mb-10">
                    <section className="section-wrap p-4 sm:p-5 md:p-6">
                        <div className="rounded-2xl overflow-hidden border border-[#efdcca] bg-white">
                            {selectedImageUrl ? (
                                <Image
                                    src={selectedImageUrl}
                                    alt={productName}
                                    width={1200}
                                    height={1200}
                                    className="w-full aspect-square object-cover"
                                />
                            ) : (
                                <div className="aspect-square flex items-center justify-center text-7xl">🔑</div>
                            )}
                        </div>

                        {gallery.length > 1 && (
                            <div className="grid grid-cols-5 gap-2 mt-3">
                                {gallery.map((img, index) => (
                                    <button
                                        key={img.id || img.url}
                                        onClick={() => setSelectedImage(index)}
                                        className={`rounded-xl overflow-hidden border ${selectedImage === index ? 'border-[#a53b2f]' : 'border-[#eedcca]'}`}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={`${productName} ${index + 1}`}
                                            width={220}
                                            height={220}
                                            className="w-full aspect-square object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="section-wrap p-5 sm:p-6 md:p-7 h-fit lg:sticky lg:top-28">
                        <p className="lux-chip mb-3">{product.category}</p>
                        <h1 className="font-display text-3xl sm:text-4xl text-[#2b1d16] mb-3">{productName}</h1>

                        <div className="flex items-center gap-3 mb-4">
                            {renderStars(Math.round(averageRating || 0), 'w-5 h-5')}
                            <span className="text-sm text-[#7d6354]">
                                {averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : 'Ancora nessuna valutazione'}
                            </span>
                            <span className="text-sm text-[#9a7d6b]">({product.reviews?.length || 0} recensioni)</span>
                        </div>

                        <p className="text-4xl font-black text-[#2e211b] mb-5">€{product.price.toFixed(2)}</p>

                        <p className="text-[#60483d] leading-relaxed mb-6">{productDescription}</p>

                        <div className="grid sm:grid-cols-3 gap-2.5 mb-5">
                            <div className="lux-card p-3 text-sm text-[#5e463b] inline-flex items-center gap-2">
                                <Truck className="w-4 h-4 text-[#a53b2f]" /> Spedizione rapida
                            </div>
                            <div className="lux-card p-3 text-sm text-[#5e463b] inline-flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#a53b2f]" /> Pagamento sicuro
                            </div>
                            <div className="lux-card p-3 text-sm text-[#5e463b] inline-flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-[#a53b2f]" /> Garanzia qualità
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <label className="text-sm font-semibold text-[#6b5144]">Quantità</label>
                            <input
                                type="number"
                                min={1}
                                max={Math.max(1, product.stock || 1)}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                                className="w-24 rounded-xl border border-[#e8d5bd] px-3 py-2 bg-[#fffdf9]"
                            />
                            <span className="text-sm text-[#7d6354]">{product.stock > 0 ? `${product.stock} disponibili` : 'Esaurito'}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || !product.inStock}
                                className="btn-lux-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Aggiungi al carrello
                            </button>

                            <button
                                onClick={handleShare}
                                className="btn-lux-secondary inline-flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-4 h-4" /> Condividi
                            </button>
                        </div>
                    </section>
                </div>

                <section className="section-wrap p-6 md:p-7 mb-10">
                    <h2 className="font-display text-3xl text-[#2b1d16] mb-4">Dettagli prodotto</h2>
                    <p className="text-[#5f473c] leading-relaxed mb-5">{productDescription}</p>

                    <div className="flex flex-wrap gap-2.5 mb-4">
                        {product.dimensions && <span className="lux-chip">Dimensioni: {product.dimensions}</span>}
                        {(product.materials || []).map((material) => (
                            <span key={material.id} className="lux-chip">Materiale: {material.name}</span>
                        ))}
                        {(product.tags || []).map((tag) => (
                            <span key={tag.id} className="lux-chip">{tag.name}</span>
                        ))}
                    </div>
                </section>

                <section className="section-wrap p-6 md:p-7 mb-10">
                    <h2 className="font-display text-3xl text-[#2b1d16] mb-6">Recensioni clienti</h2>

                    <div className="grid lg:grid-cols-[1fr_0.95fr] gap-7">
                        <div>
                            <div className="lux-card p-5 mb-5">
                                <p className="text-sm uppercase tracking-[0.16em] text-[#8b6d5b] mb-2">Valutazione media</p>
                                <p className="text-5xl font-black text-[#2f211b]">{averageRating ? averageRating.toFixed(1) : '0.0'}</p>
                                <div className="mt-2">{renderStars(Math.round(averageRating || 0), 'w-5 h-5')}</div>
                                <p className="text-sm text-[#7b6152] mt-1">{product.reviews?.length || 0} recensioni totali</p>
                            </div>

                            <div className="space-y-3 max-h-130 overflow-auto pr-1">
                                {(product.reviews || []).length === 0 && (
                                    <div className="lux-card p-5 text-[#7d6354]">Nessuna recensione ancora. Sii il primo a recensire questo prodotto.</div>
                                )}
                                {(product.reviews || []).map((review) => (
                                    <article key={review.id} className="lux-card p-4">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div>
                                                <p className="font-semibold text-[#2f211b]">{review.userName}</p>
                                                <div className="mt-1">{renderStars(review.rating)}</div>
                                            </div>
                                            <span className="text-xs text-[#8f7261]">{new Date(review.createdAt).toLocaleDateString('it-IT')}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-[#5e463b]">{review.comment}</p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="lux-card p-5 h-fit">
                            <h3 className="font-display text-2xl text-[#2b1d16] mb-3">Scrivi la tua recensione</h3>
                            {!user && (
                                <p className="text-sm text-[#7c6253] mb-3">
                                    Per lasciare una recensione devi prima
                                    {' '}
                                    <Link href="/login" className="text-[#a53b2f] font-semibold hover:underline">accedere</Link>.
                                </p>
                            )}

                            <form onSubmit={handleSubmitReview} className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-[#6f5547] mb-1 block">Valutazione</label>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                                                className="p-1"
                                            >
                                                <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-[#f2c96b] text-[#f2c96b]' : 'text-[#d8c2ab]'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-[#6f5547] mb-1 block">Commento</label>
                                    <textarea
                                        rows={5}
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Com'è stata la tua esperienza con questo prodotto?"
                                        className="w-full rounded-xl border border-[#e7d4bd] bg-[#fffdf9] px-3 py-2.5 text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!user || submittingReview}
                                    className="btn-lux-primary w-full inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingReview ? 'Invio in corso...' : 'Invia recensione'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-end justify-between mb-5">
                        <h2 className="font-display text-3xl text-[#2c1e17]">Prodotti simili</h2>
                        <Link href="/prodotti" className="text-sm font-semibold text-[#a53b2f] hover:underline">Vedi tutti</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {relatedProducts.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
