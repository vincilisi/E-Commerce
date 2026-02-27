export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Order, OrderItem, Product } from '@prisma/client'

// GET - Analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // giorni

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Ordini nel periodo
    const orders: (Order & { orderItems: OrderItem[] })[] = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'cancelled' }
      },
      include: { orderItems: true }
    })

    // Statistiche generali
    const totalOrders: number = orders.length
    const totalRevenue: number = orders.reduce((sum: number, o: Order) => sum + o.totalAmount, 0)
    const avgOrderValue: number = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Ordini per stato
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { createdAt: { gte: startDate } }
    })

    // Prodotti più venduti
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    })

    // Dettagli prodotti top
    const productIds: string[] = topProducts.map(p => p.productId)
    const products: Product[] = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    const topProductsWithDetails = topProducts.map(tp => ({
      ...tp,
      product: products.find(p => p.id === tp.productId) || null
    }))

    // Ordini per giorno (ultimi 30 giorni)
    const dailyOrders: Record<string, { orders: number; revenue: number }> = orders.reduce((acc, order: Order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      if (!acc[date]) acc[date] = { orders: 0, revenue: 0 }
      acc[date].orders++
      acc[date].revenue += order.totalAmount
      return acc
    }, {} as Record<string, { orders: number; revenue: number }>)

    // Clienti unici
    const uniqueCustomers: number = new Set(orders.map(o => o.customerEmail)).size

    // Newsletter iscritti
    const newsletterCount: number = await prisma.newsletter.count({
      where: { subscribed: true }
    })

    // Recensioni
    const reviewsCount: number = await prisma.review.count()
    const avgRatingResult = await prisma.review.aggregate({
      _avg: { rating: true }
    })
    const avgRating: number = avgRatingResult._avg.rating || 0

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        uniqueCustomers,
        newsletterSubscribers: newsletterCount,
        totalReviews: reviewsCount,
        avgRating
      },
      ordersByStatus,
      topProducts: topProductsWithDetails,
      dailyOrders,
      period: parseInt(period)
    })
  } catch (error) {
    console.error('Errore analytics:', error)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}