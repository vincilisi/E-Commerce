export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper per ottenere session ID
async function getSessionId() {
    const cookieStore = await cookies()
    let sessionId = cookieStore.get('wishlist_session')?.value
    return sessionId || null
}

// GET - Ottenere wishlist
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const sessionId = (await getSessionId()) || searchParams.get('sessionId')

        const where = userId
            ? { userId }
            : sessionId
                ? { sessionId }
                : { sessionId: 'none' }

        const wishlistItems = await prisma.wishlist.findMany({
            where
        })

        // Recupera dettagli prodotti
        const productIds = wishlistItems.map(item => item.productId)
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        })

        return NextResponse.json({
            items: wishlistItems,
            products
        })
    } catch (error) {
        console.error('Errore recupero wishlist:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Aggiungi a wishlist
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { productId, userId, sessionId } = body

        if (!productId) {
            return NextResponse.json({ error: 'productId richiesto' }, { status: 400 })
        }

        // Verifica se già esiste
        const existing = await prisma.wishlist.findFirst({
            where: userId
                ? { userId, productId }
                : { sessionId, productId }
        })

        if (existing) {
            return NextResponse.json({
                message: 'Prodotto già nei preferiti',
                item: existing
            })
        }

        const wishlistItem = await prisma.wishlist.create({
            data: {
                productId,
                userId: userId || null,
                sessionId: userId ? null : sessionId
            }
        })

        // Set cookie per sessione
        const response = NextResponse.json(wishlistItem, { status: 201 })
        if (sessionId && !userId) {
            response.cookies.set('wishlist_session', sessionId, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30 // 30 giorni
            })
        }

        return response
    } catch (error) {
        console.error('Errore aggiunta wishlist:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// DELETE - Rimuovi da wishlist
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        const userId = searchParams.get('userId')
        const sessionId = searchParams.get('sessionId')

        if (!productId) {
            return NextResponse.json({ error: 'productId richiesto' }, { status: 400 })
        }

        await prisma.wishlist.deleteMany({
            where: userId
                ? { userId, productId }
                : { sessionId, productId }
        })

        return NextResponse.json({ message: 'Rimosso dai preferiti' })
    } catch (error) {
        console.error('Errore rimozione wishlist:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
