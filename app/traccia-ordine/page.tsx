'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, MapPin, Calendar, Euro, ChevronRight } from 'lucide-react';

interface TrackingStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    completed: boolean;
    date: string | null;
    isCancelled?: boolean;
}

interface OrderItem {
    quantity: number;
    price: number;
    product: {
        name: string;
        images: string;
    };
}

interface OrderData {
    id: string;
    orderNumber: string;
    status: string;
    trackingNumber: string | null;
    customerName: string;
    shippingAddress: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
    trackingSteps: TrackingStep[];
}

export default function TrackingPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) {
            setError('Inserisci il numero d\'ordine');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const params = new URLSearchParams({ orderNumber: orderNumber.trim() });
            if (email.trim()) {
                params.append('email', email.trim());
            }

            const res = await fetch(`/api/tracking?${params}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Ordine non trovato');
                return;
            }

            setOrder(data.order);
        } catch {
            setError('Errore nella ricerca dell\'ordine');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'In Attesa';
            case 'paid': return 'Pagato';
            case 'processing': return 'In Preparazione';
            case 'shipped': return 'Spedito';
            case 'delivered': return 'Consegnato';
            case 'cancelled': return 'Cancellato';
            default: return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Torna al sito
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        📦 Traccia il tuo Ordine
                    </h1>
                    <p className="text-gray-600">
                        Inserisci il numero d&apos;ordine per vedere lo stato della spedizione
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Numero Ordine *
                            </label>
                            <input
                                type="text"
                                id="orderNumber"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                placeholder="Es: ORD-ABC123"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email (opzionale)
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Per maggiore sicurezza"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Ricerca in corso...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Traccia Ordine
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </form>

                {/* Order Result */}
                {order && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Order Header */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Numero Ordine</p>
                                    <h2 className="text-2xl font-bold text-gray-900">#{order.orderNumber}</h2>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>

                            {/* Tracking Number */}
                            {order.trackingNumber && (
                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-blue-600">Numero di Tracking</p>
                                            <p className="text-lg font-mono font-bold text-blue-800">{order.trackingNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tracking Timeline */}
                            <div className="relative">
                                {order.trackingSteps.map((step, index) => (
                                    <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                                        {/* Line */}
                                        {index < order.trackingSteps.length - 1 && (
                                            <div
                                                className={`absolute left-5 ml-0.5 w-0.5 h-full ${step.completed && order.trackingSteps[index + 1]?.completed
                                                        ? 'bg-green-500'
                                                        : step.completed
                                                            ? 'bg-gradient-to-b from-green-500 to-gray-200'
                                                            : 'bg-gray-200'
                                                    }`}
                                                style={{ top: `${index * 96 + 40}px`, height: '56px' }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${step.isCancelled
                                                    ? 'bg-red-100'
                                                    : step.completed
                                                        ? 'bg-green-100'
                                                        : 'bg-gray-100'
                                                }`}
                                        >
                                            {step.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${step.isCancelled ? 'text-red-700' : step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.title}
                                            </h3>
                                            <p className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {step.description}
                                            </p>
                                            {step.date && (
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(step.date)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div className="flex-shrink-0">
                                            {step.isCancelled ? (
                                                <XCircle className="w-6 h-6 text-red-500" />
                                            ) : step.completed ? (
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Dettagli Ordine
                            </h3>

                            {/* Products */}
                            <div className="space-y-3 mb-6">
                                {order.orderItems.map((item, index) => {
                                    const images = JSON.parse(item.product.images || '[]');
                                    return (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            {images[0] && (
                                                <img
                                                    src={images[0]}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">Quantità: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-purple-600">€{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Indirizzo di Spedizione</p>
                                        <p className="text-gray-900 whitespace-pre-line">{order.shippingAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Data Ordine</p>
                                        <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 md:col-span-2">
                                    <Euro className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Totale Ordine</p>
                                        <p className="text-2xl font-bold text-purple-600">€{order.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="bg-purple-50 rounded-2xl p-6 text-center">
                            <p className="text-purple-800 mb-2">Hai bisogno di aiuto con il tuo ordine?</p>
                            <Link
                                href="/contatti"
                                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-800"
                            >
                                Contattaci <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Help Text */}
                {!order && !error && (
                    <div className="text-center text-gray-500">
                        <p className="mb-2">📧 Hai ricevuto il numero d&apos;ordine via email dopo l&apos;acquisto</p>
                        <p className="text-sm">Non riesci a trovarlo? Controlla anche la cartella spam!</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
