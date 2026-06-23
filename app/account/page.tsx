<<<<<<< HEAD
﻿'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Calendar, Loader2, Eye } from 'lucide-react';
=======
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Calendar, Loader2, Eye, ShieldCheck, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
>>>>>>> master

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    shippingAddress: string;
    orderItems: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
        };
    }[];
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                await fetchOrders(data.user.id);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Auth failed:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async (userId: string) => {
        try {
            const res = await fetch(`/api/orders?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusColors: { [key: string]: string } = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };

        const statusLabels: { [key: string]: string } = {
            pending: 'In Attesa',
            paid: 'Pagato',
            processing: 'In Lavorazione',
            shipped: 'Spedito',
            delivered: 'Consegnato',
            cancelled: 'Annullato',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        );
    }

    return (
<<<<<<< HEAD
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
                    Il Mio Account
                </h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b-2" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-4 px-6 font-bold transition ${activeTab === 'profile' ? 'border-b-2' : ''}`}
=======
        <div className="min-h-screen py-12 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.08),transparent_30%),linear-gradient(180deg,#fff_0%,#faf7ff_40%,#fff_100%)]">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] p-5 md:p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">Personal area</p>
                        <h1 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--color-text)' }}>
                            Il Mio Account
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Dati protetti</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 font-semibold text-purple-700"><BadgeCheck className="w-4 h-4" /> Storico ordini</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-4 px-6 font-bold transition rounded-t-2xl ${activeTab === 'profile' ? 'border-b-2 bg-white/70' : ''}`}
>>>>>>> master
                        style={{
                            borderColor: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text)'
                        }}
                    >
                        <User className="inline w-5 h-5 mr-2" />
                        Profilo
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
<<<<<<< HEAD
                        className={`pb-4 px-6 font-bold transition ${activeTab === 'orders' ? 'border-b-2' : ''}`}
=======
                        className={`pb-4 px-6 font-bold transition rounded-t-2xl ${activeTab === 'orders' ? 'border-b-2 bg-white/70' : ''}`}
>>>>>>> master
                        style={{
                            borderColor: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-text)'
                        }}
                    >
                        <Package className="inline w-5 h-5 mr-2" />
                        I Miei Ordini ({orders.length})
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
<<<<<<< HEAD
                    <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
=======
                    <div className="rounded-4xl shadow-[0_18px_45px_rgba(31,41,55,0.08)] p-8 border border-white/70 bg-white/85 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--color-text)' }}>
>>>>>>> master
                            Informazioni Personali
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Nome</label>
                                <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{user?.name}</p>
                            </div>
                            <div>
                                <label className="block font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Email</label>
                                <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{user?.email}</p>
                            </div>
                            <div>
                                <label className="block font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Ruolo</label>
                                <p className="text-lg capitalize" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{user?.role}</p>
                            </div>
                            <div className="pt-4">
                                <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                    Account creato il {new Date(user?.createdAt).toLocaleDateString('it-IT')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        {orders.length === 0 ? (
<<<<<<< HEAD
                            <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--color-card-bg)' }}>
=======
                            <div className="text-center py-12 rounded-4xl border border-white/70 bg-white/85 backdrop-blur-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
>>>>>>> master
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                                    Nessun Ordine
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Non hai ancora effettuato nessun ordine.
                                </p>
                                <Link
                                    href="/prodotti"
<<<<<<< HEAD
                                    className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition inline-block"
=======
                                    className="px-8 py-3 rounded-full font-bold hover:opacity-90 transition inline-block shadow-lg"
>>>>>>> master
                                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                                >
                                    Inizia a Fare Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
<<<<<<< HEAD
                                        className="rounded-lg shadow-md p-6"
=======
                                        className="rounded-4xl shadow-[0_18px_45px_rgba(31,41,55,0.08)] p-6 border border-white/70 bg-white/85 backdrop-blur-xl"
>>>>>>> master
                                        style={{ backgroundColor: 'var(--color-card-bg)' }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                                                    Ordine #{order.orderNumber}
                                                </h3>
                                                <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(order.createdAt).toLocaleDateString('it-IT')}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{order.shippingAddress.split(',')[1] || 'Italia'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(order.status)}
                                                <p className="text-2xl font-bold mt-2" style={{ color: 'var(--color-primary)' }}>
<<<<<<< HEAD
                                                    â‚¬{order.totalAmount.toFixed(2)}
=======
                                                    €{order.totalAmount.toFixed(2)}
>>>>>>> master
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                                            <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                                                Prodotti:
                                            </h4>
                                            <div className="space-y-2">
                                                {order.orderItems.map((item) => (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                                                            {item.product.name} x {item.quantity}
                                                        </span>
                                                        <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
<<<<<<< HEAD
                                                            â‚¬{(item.price * item.quantity).toFixed(2)}
=======
                                                            €{(item.price * item.quantity).toFixed(2)}
>>>>>>> master
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                            <Link
                                                href={`/ordine/${order.id}`}
<<<<<<< HEAD
                                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border-2 hover:bg-gray-50 transition font-semibold"
=======
                                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 hover:bg-gray-50 transition font-semibold"
>>>>>>> master
                                                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Visualizza Dettagli</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
<<<<<<< HEAD

=======
>>>>>>> master
