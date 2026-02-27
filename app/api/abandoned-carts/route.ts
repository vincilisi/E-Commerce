export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lista carrelli abbandonati
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // all, pending, reminded, recovered

        const where: Partial<{ reminderSent: boolean; recovered: boolean }> = {}

        if (status === 'pending') {
            where.reminderSent = false
            where.recovered = false
        } else if (status === 'reminded') {
            where.reminderSent = true
            where.recovered = false
        } else if (status === 'recovered') {
            where.recovered = true
        }

        const carts = await prisma.abandonedCart.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        // Calcola statistiche su tutti i carrelli
        const allCarts = await prisma.abandonedCart.findMany()

        type CartType = typeof allCarts[number]

        const stats = {
            total: allCarts.length,
            pending: allCarts.filter((c: CartType) => !c.reminderSent && !c.recovered).length,
            reminded: allCarts.filter((c: CartType) => c.reminderSent && !c.recovered).length,
            recovered: allCarts.filter((c: CartType) => c.recovered).length,
            totalValue: allCarts.reduce((sum: number, c: CartType) => {
                const items: Array<{ price: number; quantity: number }> = JSON.parse(c.items || '[]')
                return sum + items.reduce((s, i) => s + (i.price * i.quantity), 0)
            }, 0),
            recoveredValue: allCarts
                .filter((c: CartType) => c.recovered)
                .reduce((sum: number, c: CartType) => {
                    const items: Array<{ price: number; quantity: number }> = JSON.parse(c.items || '[]')
                    return sum + items.reduce((s, i) => s + (i.price * i.quantity), 0)
                }, 0)
        }

        return NextResponse.json({
            carts: carts.map((c: CartType) => ({
                ...c,
                items: JSON.parse(c.items || '[]')
            })),
            stats
        })
    } catch (error) {
        console.error('Errore recupero carrelli abbandonati:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Salva carrello abbandonato
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { sessionId, email, items } = body

        if (!sessionId || !items || items.length === 0) {
            return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
        }

        type CartItem = { price: number; quantity: number }

        // Verifica se esiste già un carrello per questa sessione
        const existing = await prisma.abandonedCart.findFirst({
            where: {
                sessionId,
                recovered: false
            }
        })

        if (existing) {
            // Aggiorna il carrello esistente
            const total = items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0)
            const cart = await prisma.abandonedCart.update({
                where: { id: existing.id },
                data: {
                    customerEmail: email || existing.customerEmail,
                    items: JSON.stringify(items),
                    totalAmount: total,
                    updatedAt: new Date()
                }
            })
            return NextResponse.json(cart)
        }

        // Crea nuovo carrello abbandonato
        const cart = await prisma.abandonedCart.create({
            data: {
                sessionId,
                customerEmail: email || null,
                items: JSON.stringify(items),
                totalAmount: items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0),
                reminderSent: false,
                recovered: false
            }
        })

        return NextResponse.json(cart)
    } catch (error) {
        console.error('Errore salvataggio carrello:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}