'use client';

import { useEffect, useState } from 'react';
import { Package, Eye, Check, Truck, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function AdminOrdiniPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            toast.error('Errore nel caricamento degli ordini');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success('Stato ordine aggiornato!');
                loadOrders();
            } else {
                toast.error('Errore nell\'aggiornamento');
            }
        } catch (error) {
            toast.error('Errore nell\'aggiornamento');
        }
    }; const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-sky-100 text-sky-800',
            delivered: 'bg-stone-100 text-stone-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const labels = {
            pending: 'In Attesa',
            paid: 'Pagato',
            processing: 'In Elaborazione',
            shipped: 'Spedito',
            delivered: 'Consegnato',
            cancelled: 'Annullato'
        };

        return (
            <span className={`status-badge ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    if (loading) {
        return <div className="page-shell flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    return (
        <div className="page-shell min-h-screen py-8">
            <Toaster position="top-center" />

            <div className="container mx-auto px-4">
                <Link href="/admin" className="hover:opacity-80 mb-6 inline-block font-semibold" style={{ color: 'var(--color-primary)' }}>
                    ← Torna alla Dashboard
                </Link>

                <div className="grid gap-5 md:grid-cols-3 mb-6">
                    <div className="admin-kpi p-5">
                        <p className="eyebrow mb-2">Ordini totali</p>
                        <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{orders.length}</p>
                    </div>
                    <div className="admin-kpi p-5">
                        <p className="eyebrow mb-2">Da processare</p>
                        <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{orders.filter((order) => ['paid', 'pending', 'processing'].includes(order.status)).length}</p>
                    </div>
                    <div className="admin-kpi p-5">
                        <p className="eyebrow mb-2">Consegnati</p>
                        <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{orders.filter((order) => order.status === 'delivered').length}</p>
                    </div>
                </div>

                <div className="surface-panel p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 mr-3" style={{ color: 'var(--color-primary)' }} />
                            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Gestione Ordini</h1>
                        </div>
                        <span style={{ color: 'var(--color-text)', opacity: 0.65 }}>{orders.length} ordini totali</span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="empty-state-panel text-center py-12 px-6">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Nessun ordine presente</p>
                        </div>
                    ) : (
                        <div className="admin-grid">
                            {orders.map((order) => (
                                <div key={order.id} className="admin-row-card p-5 sm:p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-2">
                                            <p className="eyebrow">Ordine #{order.id.slice(-8)}</p>
                                            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{order.customerName}</h2>
                                            <p style={{ color: 'var(--color-text)', opacity: 0.68 }}>{order.customerEmail}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {getStatusBadge(order.status)}
                                            <span className="stat-pill">€{order.totalAmount.toFixed(2)}</span>
                                            <span className="stat-pill">{new Date(order.createdAt).toLocaleDateString('it-IT')}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-3 flex-wrap">
                                        <Link href={`/admin/ordini/${order.id}`} className="icon-action" style={{ color: 'var(--color-primary)' }} title="Visualizza dettagli">
                                            <Eye className="w-5 h-5" />
                                        </Link>

                                        {order.status === 'paid' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'processing')} className="icon-action" style={{ color: 'var(--color-primary)' }} title="Segna come in elaborazione">
                                                <Clock className="w-5 h-5" />
                                            </button>
                                        )}

                                        {order.status === 'processing' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="icon-action text-green-600 hover:text-green-700" title="Segna come spedito">
                                                <Truck className="w-5 h-5" />
                                            </button>
                                        )}

                                        {order.status === 'shipped' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="icon-action text-gray-600 hover:text-gray-700" title="Segna come consegnato">
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
