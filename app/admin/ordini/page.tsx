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
            shipped: 'bg-blue-100 text-blue-800',
            delivered: 'bg-gray-100 text-gray-800',
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
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4">
                <Link href="/admin" className="hover:opacity-80 mb-6 inline-block" style={{ color: 'var(--color-primary)' }}>
                    ← Torna alla Dashboard
                </Link>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 mr-3" style={{ color: 'var(--color-primary)' }} />
                            <h1 className="text-3xl font-bold text-gray-800">Gestione Ordini</h1>
                        </div>
                        <span className="text-gray-600">{orders.length} ordini totali</span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Nessun ordine presente</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-4 px-4">ID</th>
                                        <th className="text-left py-4 px-4">Cliente</th>
                                        <th className="text-left py-4 px-4">Email</th>
                                        <th className="text-left py-4 px-4">Totale</th>
                                        <th className="text-left py-4 px-4">Stato</th>
                                        <th className="text-left py-4 px-4">Data</th>
                                        <th className="text-left py-4 px-4">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-4 font-semibold">#{order.id}</td>
                                            <td className="py-4 px-4">{order.customerName}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{order.customerEmail}</td>
                                            <td className="py-4 px-4 font-semibold">€{order.totalAmount.toFixed(2)}</td>
                                            <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('it-IT')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/admin/ordini/${order.id}`}
                                                        className="hover:opacity-70"
                                                        style={{ color: 'var(--color-primary)' }}
                                                        title="Visualizza dettagli"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>

                                                    {order.status === 'paid' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'processing')}
                                                            className="hover:opacity-70"
                                                            style={{ color: 'var(--color-primary)' }}
                                                            title="Segna come in elaborazione"
                                                        >
                                                            <Clock className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                    {order.status === 'processing' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                            className="text-green-600 hover:text-green-700"
                                                            title="Segna come spedito"
                                                        >
                                                            <Truck className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                    {order.status === 'shipped' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                            className="text-gray-600 hover:text-gray-700"
                                                            title="Segna come consegnato"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
