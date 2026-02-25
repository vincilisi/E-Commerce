import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Ottieni fattura
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('orderId')
        const invoiceNumber = searchParams.get('invoiceNumber')

        if (orderId) {
            const invoice = await prisma.invoice.findUnique({
                where: { orderId }
            })
            return NextResponse.json(invoice)
        }

        if (invoiceNumber) {
            const invoice = await prisma.invoice.findUnique({
                where: { invoiceNumber }
            })
            return NextResponse.json(invoice)
        }

        // Lista tutte le fatture
        const invoices = await prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(invoices)
    } catch (error) {
        console.error('Errore fatture:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Genera fattura per ordine
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orderId, customerVat, customerAddress } = body

        // Verifica se fattura esiste già
        const existingInvoice = await prisma.invoice.findUnique({
            where: { orderId }
        })

        if (existingInvoice) {
            return NextResponse.json(existingInvoice)
        }

        // Recupera ordine
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { orderItems: { include: { product: true } } }
        })

        if (!order) {
            return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
        }

        // Genera numero fattura
        const year = new Date().getFullYear()
        const count = await prisma.invoice.count({
            where: {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`)
                }
            }
        })
        const invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`

        // Calcola importi
        const subtotal = order.totalAmount
        const taxRate = 0.22 // IVA 22%
        const tax = subtotal * taxRate
        const total = subtotal + tax

        // Prepara items
        const items = order.orderItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        }))

        const invoice = await prisma.invoice.create({
            data: {
                orderId,
                invoiceNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerAddress: customerAddress || order.shippingAddress,
                customerVat: customerVat || null,
                items: JSON.stringify(items),
                subtotal,
                tax,
                total
            }
        })

        return NextResponse.json(invoice, { status: 201 })
    } catch (error) {
        console.error('Errore generazione fattura:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
