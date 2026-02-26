export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Simula pagamento PayPal (FITTIZIO - per demo)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            items,
            customerName,
            customerEmail,
            shippingAddress,
            discountCode
        } = body

        // Simula validazione PayPal
        if (!items || items.length === 0) {
            return NextResponse.json({
                error: 'Il carrello è vuoto'
            }, { status: 400 })
        }

        // Calcola totale
        let totalAmount = items.reduce((sum: number, item: { price: number, quantity: number }) => {
            return sum + (item.price * item.quantity)
        }, 0)

        // Applica sconto se presente
        if (discountCode) {
            const discount = await prisma.discountCode.findUnique({
                where: { code: discountCode.toUpperCase() }
            })

            if (discount && discount.active) {
                if (discount.type === 'percentage') {
                    totalAmount = totalAmount * (1 - discount.value / 100)
                } else {
                    totalAmount = Math.max(0, totalAmount - discount.value)
                }

                // Incrementa uso codice
                await prisma.discountCode.update({
                    where: { code: discountCode.toUpperCase() },
                    data: { usedCount: { increment: 1 } }
                })
            }
        }

        // Genera ID pagamento fittizio PayPal
        const paypalPaymentId = `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        const orderNumber = `ORD-${Date.now()}`

        // Crea ordine
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                orderNumber,
                status: 'paid',
                totalAmount,
                shippingAddress: typeof shippingAddress === 'string'
                    ? shippingAddress
                    : JSON.stringify(shippingAddress),
                stripePaymentId: paypalPaymentId, // Usiamo stesso campo per PayPal
                orderItems: {
                    create: items.map((item: { productId: string, quantity: number, price: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { orderItems: true }
        })

        // Aggiorna stock prodotti
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            })
        }

        // Simula risposta PayPal
        return NextResponse.json({
            success: true,
            paymentMethod: 'paypal',
            paymentId: paypalPaymentId,
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: 'COMPLETED',
            message: 'Pagamento PayPal simulato con successo!',
            // Dati fittizi PayPal
            payer: {
                email_address: customerEmail,
                payer_id: `PAYER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                name: {
                    given_name: customerName.split(' ')[0],
                    surname: customerName.split(' ').slice(1).join(' ') || ''
                }
            },
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: totalAmount.toFixed(2)
                },
                shipping: {
                    address: shippingAddress
                }
            }]
        }, { status: 201 })
    } catch (error) {
        console.error('Errore PayPal fittizio:', error)
        return NextResponse.json({
            error: 'Errore durante il pagamento',
            details: error instanceof Error ? error.message : 'Errore sconosciuto'
        }, { status: 500 })
    }
}

// GET - Verifica stato pagamento (fittizio)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const paymentId = searchParams.get('paymentId')

        if (!paymentId) {
            return NextResponse.json({ error: 'paymentId richiesto' }, { status: 400 })
        }

        // Cerca ordine con questo payment ID
        const order = await prisma.order.findFirst({
            where: { stripePaymentId: paymentId }
        })

        if (!order) {
            return NextResponse.json({
                status: 'NOT_FOUND',
                message: 'Pagamento non trovato'
            }, { status: 404 })
        }

        return NextResponse.json({
            paymentId,
            status: order.status === 'paid' ? 'COMPLETED' : 'PENDING',
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.totalAmount
        })
    } catch (error) {
        console.error('Errore verifica PayPal:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
