'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/lib/store/cartStore';
import { Lock, CreditCard } from 'lucide-react';
=======
import { useCartStore } from '@/lib/store/cartStore';
import { Lock, Truck, ShieldCheck, BadgeCheck } from 'lucide-react';
>>>>>>> master
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

<<<<<<< HEAD
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

=======
>>>>>>> master
export default function CheckoutPage() {
    const { language, t, formatPrice } = useLanguage();
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState<{ amount: number; code: string } | null>(null);
    const [applyingDiscount, setApplyingDiscount] = useState(false);
<<<<<<< HEAD
=======
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cod'>('paypal');
>>>>>>> master

    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Italia'
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
<<<<<<< HEAD
                setUser(data.user);
                setShippingInfo(prev => ({
                    ...prev,
                    email: data.user.email,
                    name: data.user.name
                }));
=======
                if (data.user) {
                    setUser(data.user);
                    setShippingInfo(prev => ({
                        ...prev,
                        email: data.user.email || '',
                        name: data.user.name || ''
                    }));
                } else {
                    setUser(null);
                }
>>>>>>> master
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    const subtotal = getTotalPrice();
    const shipping = 5.00;
    const discountAmount = discount?.amount || 0;
    const total = Math.max(0, subtotal + shipping - discountAmount);

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            toast.error('Inserisci un codice sconto');
            return;
        }

        setApplyingDiscount(true);
        try {
            const res = await fetch('/api/discount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode.toUpperCase(), cartTotal: subtotal })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setDiscount({ amount: data.discountAmount, code: data.code });
                toast.success(`Codice sconto applicato! Risparmi €${data.discountAmount.toFixed(2)}`);
            } else {
                toast.error(data.error || 'Codice sconto non valido');
            }
        } catch (error) {
            toast.error('Errore nell\'applicazione del codice sconto');
        } finally {
            setApplyingDiscount(false);
        }
    };

    const handleRemoveDiscount = () => {
        setDiscount(null);
        setDiscountCode('');
        toast.success('Codice sconto rimosso');
    };

    const handleCheckout = async () => {
        if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address ||
            !shippingInfo.city || !shippingInfo.postalCode) {
            toast.error('Compila tutti i campi richiesti');
            return;
        }

        if (items.length === 0) {
            toast.error('Il carrello è vuoto');
            return;
        }

        setLoading(true);

        try {
            console.log('Invio ordine:', { items, shippingInfo, userId: user?.id });

<<<<<<< HEAD
            const res = await fetch('/api/checkout', {
=======
            const endpoint = paymentMethod === 'paypal' ? '/api/payments/paypal' : '/api/checkout';
            const res = await fetch(endpoint, {
>>>>>>> master
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingInfo,
<<<<<<< HEAD
                    userId: user?.id
=======
                    userId: user?.id,
                    paymentMethod
>>>>>>> master
                })
            });

            const data = await res.json();
            console.log('Risposta checkout:', data);

            if (!res.ok) {
                const errorMsg = data.details
                    ? `${data.error}: ${data.details}`
                    : data.error || 'Errore nel checkout';
                console.error('Errore API:', errorMsg, 'Code:', data.code);
                toast.error(errorMsg);
                return;
            }

<<<<<<< HEAD
            if (data.testMode) {
                // Modalità test - reindirizza direttamente alla pagina di successo
                toast.success('🧪 Ordine simulato con successo!');
                clearCart();
                router.push(data.redirectUrl);
            } else if (data.url) {
                // Modalità Stripe reale - usa l'URL di checkout
                window.location.href = data.url;
            } else if (data.sessionId) {
                // Vecchia modalità con sessionId
                const stripe = await stripePromise;
                if (stripe) {
                    await (stripe as any).redirectToCheckout({ sessionId: data.sessionId });
                }
            } else {
                toast.error('Errore nella creazione del pagamento');
            }
=======
            if (paymentMethod === 'paypal') {
                if (data.approveUrl) {
                    window.location.href = data.approveUrl;
                    return;
                }

                toast.error(data.error || 'Errore nella creazione pagamento PayPal');
                return;
            }

            if (paymentMethod === 'cod') {
                toast.success('Ordine confermato! Pagherai alla consegna.');
                clearCart();
                router.push(data.redirectUrl || `/ordine/successo?cod_order=${data.orderId}`);
                return;
            }

            toast.error('Errore nella creazione del pagamento');
>>>>>>> master
        } catch (error) {
            console.error('Errore checkout:', error);
            toast.error('Errore nel processare il pagamento');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Carrello Vuoto</h2>
                    <p className="mb-6" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Aggiungi prodotti al carrello prima di procedere al checkout</p>
                    <Link href="/prodotti" className="px-6 py-3 rounded-lg hover:opacity-90 transition inline-block" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}>
                        Vai ai Prodotti
                    </Link>
                </div>
            </div>
        );
    }

    return (
<<<<<<< HEAD
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Banner Modalità Test */}
                {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('pk_test') && (
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Modalità Test Attiva:</strong> I pagamenti vengono simulati automaticamente. Nessuna carta di credito verrà addebitata.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8" style={{ color: 'var(--color-text)' }}>Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form spedizione */}
                    <div className="lg:col-span-2 rounded-lg shadow-md p-4 sm:p-6 md:p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--color-text)' }}>Informazioni di Spedizione</h2>
=======
        <div className="min-h-screen py-12 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.06),transparent_30%),linear-gradient(180deg,#fff_0%,#faf7ff_36%,#fff_100%)]">
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(31,41,55,0.08)] p-4 md:p-6 mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">Checkout experience</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black" style={{ color: 'var(--color-text)' }}>Checkout</h1>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Pagamenti sicuri</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-700"><Truck className="w-4 h-4" /> Consegna tracciata</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 font-semibold text-purple-700"><BadgeCheck className="w-4 h-4" /> Conferma email + PDF</span>
                    </div>
                </div>

                {/* Banner Pagamenti */}
                <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl shadow-sm">
                    <div className="flex">
                        <div className="shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Metodi disponibili:</strong> PayPal online oppure pagamento alla consegna.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form spedizione */}
                    <div className="lg:col-span-2 rounded-4xl shadow-[0_18px_45px_rgba(31,41,55,0.08)] p-4 sm:p-6 md:p-8 border border-white/70 bg-white/85 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6" style={{ color: 'var(--color-text)' }}>Informazioni di Spedizione</h2>
>>>>>>> master

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Nome Completo *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.name}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Mario Rossi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Indirizzo *</label>
                                <input
                                    type="text"
                                    value={shippingInfo.address}
                                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    placeholder="Via Roma 123"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Città *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.city}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Milano"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">CAP *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.postalCode}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="20100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Paese *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.country}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Italia"
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Riepilogo ordine */}
                    <div className="lg:col-span-1">
<<<<<<< HEAD
                        <div className="rounded-lg shadow-md p-4 sm:p-6 sticky top-4" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>Riepilogo Ordine</h2>
=======
                        <div className="rounded-4xl shadow-[0_18px_45px_rgba(31,41,55,0.1)] p-4 sm:p-6 sticky top-4 border border-white/70 bg-white/90 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <h2 className="text-lg sm:text-xl font-black mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>Riepilogo Ordine</h2>

                            <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                <p className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Metodo di pagamento</p>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition" style={{ borderColor: paymentMethod === 'paypal' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'paypal' ? 'rgba(147,51,234,0.06)' : 'transparent' }}>
                                        <div>
                                            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>PayPal</p>
                                            <p className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Pagamento con account PayPal o carta</p>
                                        </div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')}
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition" style={{ borderColor: paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'cod' ? 'rgba(147,51,234,0.06)' : 'transparent' }}>
                                        <div>
                                            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Pagamento alla consegna</p>
                                            <p className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Paghi quando ricevi il pacco</p>
                                        </div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                        />
                                    </label>
                                </div>
                            </div>
>>>>>>> master

                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
<<<<<<< HEAD
                                            {(item as any).translations?.name?.[language] || item.name} x {item.quantity}
=======
                                            {item.translations?.name?.[language] || item.name} x {item.quantity}
>>>>>>> master
                                        </span>
                                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <label className="block font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                                    Codice Sconto
                                </label>
                                {discount ? (
                                    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 border border-green-200">
                                        <div>
                                            <p className="text-sm font-bold text-green-800">{discount.code}</p>
                                            <p className="text-xs text-green-600">-{formatPrice(discount.amount)}</p>
                                        </div>
                                        <button
                                            onClick={handleRemoveDiscount}
                                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                        >
                                            Rimuovi
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                            placeholder="CODICE"
                                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        />
                                        <button
                                            onClick={handleApplyDiscount}
                                            disabled={applyingDiscount}
                                            className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                                        >
                                            {applyingDiscount ? '...' : 'Applica'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotale</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Spedizione</span>
                                    <span>{formatPrice(shipping)}</span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>Sconto ({discount.code})</span>
                                        <span>-{formatPrice(discount.amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                                    <span>Totale</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full mt-6 py-4 rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
<<<<<<< HEAD
                                <Lock className="w-5 h-5" />
                                <span>{loading ? 'Elaborazione...' : 'Procedi al Pagamento'}</span>
=======
                                {paymentMethod === 'cod' ? <Truck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                <span>{loading ? 'Elaborazione...' : paymentMethod === 'paypal' ? 'Paga con PayPal' : 'Conferma ordine'}</span>
>>>>>>> master
                            </button>

                            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                                <CreditCard className="w-4 h-4" />
<<<<<<< HEAD
                                <span>Pagamento sicuro con Stripe</span>
=======
                                <span>{paymentMethod === 'paypal' ? 'Pagamento sicuro con PayPal' : 'Pagamento alla consegna'}</span>
>>>>>>> master
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
