'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { Lock, Wallet, Truck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function CheckoutPage() {
    const { formatPrice } = useLanguage();
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState<{ amount: number; code: string } | null>(null);
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cod'>('paypal');

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
                const authUser = data?.user ?? null;
                setUser(authUser);

                if (authUser) {
                    setShippingInfo(prev => ({
                        ...prev,
                        email: authUser.email || prev.email,
                        name: authUser.name || prev.name
                    }));
                }
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
        } catch {
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

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingInfo,
                    userId: user?.id,
                    paymentMethod
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

            if (data.testMode) {
                // Modalità test - reindirizza direttamente alla pagina di successo
                toast.success('🧪 Ordine simulato con successo!');
                clearCart();
                router.push(data.redirectUrl);
            } else if (data.provider === 'paypal' && data.approveUrl) {
                window.location.href = data.approveUrl;
            } else if (data.provider === 'cod' && data.redirectUrl) {
                toast.success('Ordine confermato con pagamento alla consegna');
                clearCart();
                router.push(data.redirectUrl);
            } else {
                toast.error('Errore nella creazione del pagamento');
            }
        } catch (error) {
            console.error('Errore checkout:', error);
            toast.error('Errore nel processare il pagamento');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="page-shell min-h-screen flex items-center justify-center">
                <div className="empty-state-panel text-center px-8 py-10 max-w-xl w-full">
                    <p className="eyebrow justify-center mb-4">Checkout pronto</p>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 title-balance" style={{ color: 'var(--color-text)' }}>Carrello Vuoto</h2>
                    <p className="mb-8 text-base sm:text-lg" style={{ color: 'var(--color-text)', opacity: 0.72 }}>Aggiungi prodotti al carrello prima di procedere al checkout.</p>
                    <Link href="/prodotti" className="btn-lux-primary inline-flex items-center justify-center">
                        Vai ai Prodotti
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell min-h-screen">
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-6xl">
                <section className="hero-shell px-6 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10 mb-8 md:mb-10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="eyebrow mb-3">Ordine protetto</p>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold title-balance" style={{ color: 'var(--color-text)' }}>Checkout moderno, pulito e pronto al pagamento.</h1>
                            <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.74 }}>
                                Compila una volta sola, controlla il riepilogo e completa l'acquisto con PayPal o pagamento alla consegna.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="stat-pill"><Lock className="w-4 h-4" /> Checkout sicuro</span>
                            <span className="stat-pill"><Wallet className="w-4 h-4" /> PayPal attivo</span>
                            <span className="stat-pill"><Truck className="w-4 h-4" /> Contrassegno disponibile</span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form spedizione */}
                    <div className="lg:col-span-2 surface-panel p-5 sm:p-7 md:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Informazioni di Spedizione</h2>

                        <form className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Nome Completo *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.name}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                        className="form-input"
                                        placeholder="Mario Rossi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                        className="form-input"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Indirizzo *</label>
                                <input
                                    type="text"
                                    value={shippingInfo.address}
                                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                    className="form-input"
                                    placeholder="Via Roma 123"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="form-label">Città *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.city}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                        className="form-input"
                                        placeholder="Milano"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">CAP *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.postalCode}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                                        className="form-input"
                                        placeholder="20100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Paese *</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.country}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                        className="form-input"
                                        placeholder="Italia"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="form-label mb-3">Metodo di pagamento *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`choice-card text-left p-4 sm:p-5 ${paymentMethod === 'paypal' ? 'choice-card-active' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                                            <Wallet className="w-5 h-5" /> PayPal
                                        </div>
                                        <p className="text-sm mt-2" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Paga dal tuo account PayPal con flusso rapido e familiare.</p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`choice-card text-left p-4 sm:p-5 ${paymentMethod === 'cod' ? 'choice-card-active' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                                            <Truck className="w-5 h-5" /> Contrassegno
                                        </div>
                                        <p className="text-sm mt-2" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Paghi alla consegna mantenendo la conferma ordine immediata.</p>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Riepilogo ordine */}
                    <div className="lg:col-span-1">
                        <div className="surface-panel p-5 sm:p-6 sticky top-24">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Riepilogo Ordine</h2>

                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-4 text-sm rounded-2xl px-3 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.72)' }}>
                                        <span style={{ color: 'var(--color-text)', opacity: 0.72 }}>
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span className="font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <label className="form-label mb-2">
                                    Codice Sconto
                                </label>
                                {discount ? (
                                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-green-200 bg-green-50">
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
                                            className="form-input flex-1 min-h-0 py-3"
                                        />
                                        <button
                                            onClick={handleApplyDiscount}
                                            disabled={applyingDiscount}
                                            className="btn-lux-primary px-5 disabled:opacity-50"
                                        >
                                            {applyingDiscount ? '...' : 'Applica'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 space-y-3" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="flex justify-between" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                    <span>Subtotale</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                    <span>Spedizione</span>
                                    <span>{formatPrice(shipping)}</span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>Sconto ({discount.code})</span>
                                        <span>-{formatPrice(discount.amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold pt-3 border-t" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
                                    <span>Totale</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="btn-lux-primary w-full mt-6 py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Lock className="w-5 h-5" />
                                <span>{loading ? 'Elaborazione...' : paymentMethod === 'cod' ? 'Conferma ordine (Contrassegno)' : 'Procedi al Pagamento'}</span>
                            </button>

                            <div className="mt-4 flex items-center justify-center space-x-2 text-sm" style={{ color: 'var(--color-text)', opacity: 0.64 }}>
                                <Wallet className="w-4 h-4" />
                                <span>
                                    {paymentMethod === 'paypal' && 'Reindirizzamento sicuro su PayPal'}
                                    {paymentMethod === 'cod' && 'Pagamento alla consegna'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
