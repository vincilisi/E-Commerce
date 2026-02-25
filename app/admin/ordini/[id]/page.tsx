'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, User, Mail, MapPin, Calendar, CreditCard, ArrowLeft, Truck, Send, Copy, Check } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
                setTrackingNumber(data.order.trackingNumber || '');
            } else {
                toast.error('Ordine non trovato');
                router.push('/admin/ordini');
            }
        } catch (error) {
            toast.error('Errore nel caricamento');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success('Stato aggiornato!');
                loadOrder();
            } else {
                toast.error('Errore nell\'aggiornamento');
            }
        } catch (error) {
            toast.error('Errore nell\'aggiornamento');
        }
    };

    const saveTracking = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingNumber })
            });

            if (res.ok) {
                toast.success('Tracking salvato!');
                loadOrder();
            } else {
                toast.error('Errore nel salvataggio');
            }
        } catch (error) {
            toast.error('Errore nel salvataggio');
        }
    };

    const sendShippingEmail = async () => {
        if (!order.trackingNumber) {
            toast.error('Inserisci prima il numero di tracking');
            return;
        }

        setSendingEmail(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'shipping' })
            });

            if (res.ok) {
                toast.success('Email di spedizione inviata!');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Errore nell\'invio email');
            }
        } catch (error) {
            toast.error('Errore nell\'invio email');
        } finally {
            setSendingEmail(false);
        }
    };

    const copyTrackingLink = () => {
        const trackingUrl = `${window.location.origin}/traccia-ordine?orderNumber=${order.orderNumber || order.id}`;
        navigator.clipboard.writeText(trackingUrl);
        setCopied(true);
        toast.success('Link copiato!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-5xl">
                <Link href="/admin/ordini" className="hover:opacity-80 mb-6 inline-flex items-center" style={{ color: 'var(--color-primary)' }}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Torna agli Ordini
                </Link>

                <div className="rounded-lg shadow-md p-8 mb-6" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Ordine #{order.id}</h1>
                        <select
                            value={order.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="pending">In Attesa</option>
                            <option value="paid">Pagato</option>
                            <option value="processing">In Elaborazione</option>
                            <option value="shipped">Spedito</option>
                            <option value="delivered">Consegnato</option>
                            <option value="cancelled">Annullato</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <User className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Cliente</p>
                                    <p className="font-semibold">{order.customerName}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{order.customerEmail}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Indirizzo di Spedizione</p>
                                    <p className="font-semibold">{order.shippingAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Data Ordine</p>
                                    <p className="font-semibold">
                                        {new Date(order.createdAt).toLocaleString('it-IT')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <CreditCard className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Pagamento</p>
                                    <p className="font-semibold">
                                        {order.stripePaymentId ? `Stripe: ${order.stripePaymentId.substring(0, 20)}...` : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Package className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Totale</p>
                                    <p className="font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>€{order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Section */}
                    <div className="border rounded-lg p-6 mb-8" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Tracking Spedizione</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Numero di Tracking
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                                        placeholder="Es: BRT123456789"
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                                    />
                                    <button
                                        onClick={saveTracking}
                                        className="px-4 py-2 rounded-lg text-white font-medium"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        Salva
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Azioni Email
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={sendShippingEmail}
                                        disabled={sendingEmail || !order.trackingNumber}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sendingEmail ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        Invia Email Spedizione
                                    </button>
                                    <button
                                        onClick={copyTrackingLink}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                        title="Copia link tracking"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {order.trackingNumber && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    📦 Tracking attivo: <span className="font-mono font-bold">{order.trackingNumber}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Il cliente può tracciare l&apos;ordine su: <a href={`/traccia-ordine?orderNumber=${order.orderNumber || order.id}`} className="underline" target="_blank">/traccia-ordine</a>
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Prodotti</h2>
                        <div className="space-y-3">
                            {order.orderItems.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-3">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-2xl">🔑</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">Quantità: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">€{item.price.toFixed(2)} cad.</p>
                                        <p className="text-sm text-gray-600">Tot: €{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
