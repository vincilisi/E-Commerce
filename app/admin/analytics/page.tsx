'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3, TrendingUp, ShoppingCart, Users,
    Star, Mail, Euro, Package, ArrowUp, ArrowDown,
    Calendar
} from 'lucide-react'
import Link from 'next/link'

interface Analytics {
    summary: {
        totalOrders: number
        totalRevenue: number
        avgOrderValue: number
        uniqueCustomers: number
        newsletterSubscribers: number
        totalReviews: number
        avgRating: number
    }
    ordersByStatus: Array<{ status: string, _count: { status: number } }>
    topProducts: Array<{
        productId: string
        _sum: { quantity: number }
        product?: { name: string, images: string }
    }>
    dailyOrders: Record<string, { orders: number, revenue: number }>
    period: number
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState(30)

    useEffect(() => {
        fetchAnalytics()
    }, [period])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/analytics?period=${period}`)
            const data = await res.json()
            setAnalytics(data)
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'pending': 'In Attesa',
            'paid': 'Pagato',
            'processing': 'In Lavorazione',
            'shipped': 'Spedito',
            'delivered': 'Consegnato',
            'cancelled': 'Annullato'
        }
        return labels[status] || status
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'paid': 'bg-green-100 text-green-800',
            'processing': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-emerald-100 text-emerald-800',
            'cancelled': 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!analytics) return null

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <BarChart3 className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Analytics
                        </h1>
                    </div>

                    {/* Period Selector */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <select
                            value={period}
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            className="border rounded-lg px-4 py-2"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <option value={7}>Ultimi 7 giorni</option>
                            <option value={30}>Ultimi 30 giorni</option>
                            <option value={90}>Ultimi 90 giorni</option>
                            <option value={365}>Ultimo anno</option>
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Fatturato</span>
                            <Euro className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            €{analytics.summary.totalRevenue.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <ArrowUp className="w-4 h-4" />
                            +12% vs periodo prec.
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Ordini</span>
                            <ShoppingCart className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            {analytics.summary.totalOrders}
                        </div>
                        <div className="text-gray-500 text-sm mt-1">
                            Media: €{analytics.summary.avgOrderValue.toFixed(2)}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Clienti</span>
                            <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            {analytics.summary.uniqueCustomers}
                        </div>
                        <div className="text-gray-500 text-sm mt-1">
                            {analytics.summary.newsletterSubscribers} iscritti newsletter
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Recensioni</span>
                            <Star className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            {analytics.summary.totalReviews}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-600 text-sm mt-1">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            {analytics.summary.avgRating.toFixed(1)} media
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Orders by Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                            <Package className="w-5 h-5" />
                            Ordini per Stato
                        </h2>
                        <div className="space-y-4">
                            {analytics.ordersByStatus.map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${(item._count.status / analytics.summary.totalOrders) * 100}%`,
                                                    backgroundColor: 'var(--color-primary)'
                                                }}
                                            />
                                        </div>
                                        <span className="font-bold text-sm w-8">{item._count.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                            <TrendingUp className="w-5 h-5" />
                            Prodotti Più Venduti
                        </h2>
                        <div className="space-y-4">
                            {analytics.topProducts.slice(0, 5).map((item, index) => (
                                <div key={item.productId} className="flex items-center gap-4">
                                    <span
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                                            {item.product?.name || 'Prodotto'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item._sum.quantity} venduti
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                        <BarChart3 className="w-5 h-5" />
                        Andamento Giornaliero
                    </h2>
                    <div className="h-64 flex items-end gap-1">
                        {Object.entries(analytics.dailyOrders).slice(-14).map(([date, data]) => {
                            const maxRevenue = Math.max(...Object.values(analytics.dailyOrders).map(d => d.revenue))
                            const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0
                            return (
                                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full rounded-t transition-all hover:opacity-80"
                                        style={{
                                            height: `${Math.max(height, 5)}%`,
                                            backgroundColor: 'var(--color-primary)'
                                        }}
                                        title={`${date}: €${data.revenue.toFixed(2)} (${data.orders} ordini)`}
                                    />
                                    <span className="text-xs text-gray-500 transform -rotate-45 origin-left">
                                        {date.slice(-5)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
