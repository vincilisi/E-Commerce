'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Mail, Check, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface AbandonedCart {
    id: string;
    sessionId: string;
    email: string | null;
    items: CartItem[];
    reminderSent: boolean;
    recovered: boolean;
    createdAt: string;
}

interface Stats {
    total: number;
    pending: number;
    reminded: number;
    recovered: number;
    totalValue: number;
    recoveredValue: number;
}

export default function AbandonedCartsPage() {
    const [carts, setCarts] = useState<AbandonedCart[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'reminded' | 'recovered'>('pending');
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!loading) {
            fetchCarts();
        }
    }, [filter]);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (!data.user || data.user.role !== 'admin') {
                router.push('/login');
            } else {
                setLoading(false);
                fetchCarts();
            }
        } catch (error) {
            router.push('/login');
        }
    };

    const fetchCarts = async () => {
        try {
            const res = await fetch(`/api/abandoned-carts?status=${filter}`);
            const data = await res.json();
            setCarts(data.carts || []);
            setStats(data.stats);
        } catch (error) {
            console.error('Errore:', error);
            toast.error('Errore nel caricamento');
        }
    };

    const handleSendReminder = async (cartId: string) => {
        setSendingEmail(cartId);
        try {
            const res = await fetch(`/api/abandoned-carts/${cartId}`, {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(`Email inviata! Codice sconto: ${data.discountCode}`);
                fetchCarts();
            } else {
                toast.error(data.error || 'Errore invio email');
            }
        } catch (error) {
            toast.error('Errore invio email');
        } finally {
            setSendingEmail(null);
        }
    };

    const handleMarkRecovered = async (cartId: string) => {
        try {
            const res = await fetch(`/api/abandoned-carts/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recovered: true })
            });

            if (res.ok) {
                toast.success('Carrello segnato come recuperato');
                fetchCarts();
            }
        } catch (error) {
            toast.error('Errore');
        }
    };

    const handleDelete = async (cartId: string) => {
        if (!confirm('Eliminare questo carrello?')) return;

        try {
            const res = await fetch(`/api/abandoned-carts/${cartId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Carrello eliminato');
                fetchCarts();
            }
        } catch (error) {
            toast.error('Errore eliminazione');
        }
    };

    const getCartTotal = (items: CartItem[]) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const getTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return `${hours}h fa`;
        const days = Math.floor(hours / 24);
        return `${days} giorni fa`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Caricamento...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4">
                <Link href="/admin" className="inline-flex items-center mb-6 hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Torna alla Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                        <ShoppingCart className="inline-block w-8 h-8 mr-3" />
                        Carrelli Abbandonati
                    </h1>
                    <button
                        onClick={fetchCarts}
                        className="p-2 rounded-lg hover:opacity-80"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Statistiche */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <p className="text-sm opacity-70" style={{ color: 'var(--color-text)' }}>In Attesa</p>
                            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{stats.pending}</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <p className="text-sm opacity-70" style={{ color: 'var(--color-text)' }}>Email Inviate</p>
                            <p className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>{stats.reminded}</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <p className="text-sm opacity-70" style={{ color: 'var(--color-text)' }}>Recuperati</p>
                            <p className="text-2xl font-bold text-green-600">{stats.recovered}</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <p className="text-sm opacity-70" style={{ color: 'var(--color-text)' }}>Valore Recuperato</p>
                            <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>â‚¬{stats.recoveredValue.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                {/* Filtri */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {(['pending', 'reminded', 'recovered', 'all'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${filter === f ? 'text-white' : ''}`}
                            style={{
                                backgroundColor: filter === f ? 'var(--color-primary)' : 'var(--color-card-bg)',
                                color: filter === f ? 'var(--color-button-text)' : 'var(--color-text)'
                            }}
                        >
                            {f === 'pending' && 'In Attesa'}
                            {f === 'reminded' && 'Email Inviate'}
                            {f === 'recovered' && 'Recuperati'}
                            {f === 'all' && 'Tutti'}
                        </button>
                    ))}
                </div>

                {/* Lista Carrelli */}
                {carts.length === 0 ? (
                    <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text)' }} />
                        <p style={{ color: 'var(--color-text)' }}>Nessun carrello abbandonato in questa categoria</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {carts.map((cart) => (
                            <div
                                key={cart.id}
                                className="rounded-lg p-4 md:p-6"
                                style={{ backgroundColor: 'var(--color-card-bg)' }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {cart.recovered ? (
                                                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                                    âœ“ Recuperato
                                                </span>
                                            ) : cart.reminderSent ? (
                                                <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                                    ðŸ“§ Email Inviata
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                                    â³ In Attesa
                                                </span>
                                            )}
                                            <span className="text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
                                                {getTimeAgo(cart.createdAt)}
                                            </span>
                                        </div>

                                        <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                            {cart.email || 'Email non disponibile'}
                                        </p>

                                        <div className="text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                                            {cart.items.map((item, i) => (
                                                <span key={i}>
                                                    {item.name} x{item.quantity}
                                                    {i < cart.items.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                            â‚¬{getCartTotal(cart.items).toFixed(2)}
                                        </p>

                                        <div className="flex gap-2">
                                            {!cart.recovered && cart.email && (
                                                <button
                                                    onClick={() => handleSendReminder(cart.id)}
                                                    disabled={sendingEmail === cart.id}
                                                    className="p-2 rounded-lg hover:opacity-80 disabled:opacity-50"
                                                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                                                    title="Invia email di recupero"
                                                >
                                                    <Mail className={`w-5 h-5 ${sendingEmail === cart.id ? 'animate-pulse' : ''}`} />
                                                </button>
                                            )}

                                            {!cart.recovered && (
                                                <button
                                                    onClick={() => handleMarkRecovered(cart.id)}
                                                    className="p-2 rounded-lg hover:opacity-80 bg-green-600 text-white"
                                                    title="Segna come recuperato"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(cart.id)}
                                                className="p-2 rounded-lg hover:opacity-80 bg-red-600 text-white"
                                                title="Elimina"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="mt-8 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
                    <h3 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>ðŸ’¡ Come funziona</h3>
                    <ul className="text-sm space-y-1 opacity-80" style={{ color: 'var(--color-text)' }}>
                        <li>â€¢ I carrelli abbandonati vengono salvati automaticamente quando un utente aggiunge prodotti ma non completa l&apos;ordine</li>
                        <li>â€¢ Puoi inviare email di recupero con un codice sconto del 10%</li>
                        <li>â€¢ Quando un cliente completa l&apos;ordine dopo il reminder, segna il carrello come &quot;Recuperato&quot;</li>
                        <li>â€¢ Le statistiche ti mostrano il tasso di recupero e il valore recuperato</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

