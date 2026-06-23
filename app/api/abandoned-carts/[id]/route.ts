<<<<<<< HEAD
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Aggiorna stato carrello
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

=======
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Aggiorna stato carrello (es. segna come recuperato)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
>>>>>>> master
        const body = await request.json()
        const { reminderSent, recovered, email } = body

        const updateData: Record<string, unknown> = {}
        if (reminderSent !== undefined) updateData.reminderSent = reminderSent
        if (recovered !== undefined) updateData.recovered = recovered
<<<<<<< HEAD
        if (email !== undefined) updateData.customerEmail = email
=======
        if (email !== undefined) updateData.email = email
>>>>>>> master

        const cart = await prisma.abandonedCart.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(cart)
    } catch (error) {
        console.error('Errore aggiornamento carrello:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// DELETE - Elimina carrello
export async function DELETE(
    request: NextRequest,
<<<<<<< HEAD
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

=======
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
>>>>>>> master
        await prisma.abandonedCart.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Carrello eliminato' })
    } catch (error) {
        console.error('Errore eliminazione carrello:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Invia email di recupero
export async function POST(
    request: NextRequest,
<<<<<<< HEAD
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
=======
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
>>>>>>> master

        const cart = await prisma.abandonedCart.findUnique({
            where: { id }
        })

        if (!cart) {
            return NextResponse.json({ error: 'Carrello non trovato' }, { status: 404 })
        }

<<<<<<< HEAD
        if (!(cart as any).customerEmail) {
            return NextResponse.json({ error: 'Email non disponibile' }, { status: 400 })
        }

        const items = JSON.parse(cart.items || '[]')
        const total = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        )

        const discountCode = `TORNA-${cart.id.slice(-6).toUpperCase()}`

        console.log(`
📧 EMAIL DI RECUPERO CARRELLO (Simulata)
----------------------------------------
A: ${(cart as any).customerEmail}
Oggetto: Hai dimenticato qualcosa nel carrello! 🛒

${items
    .map(
        (item: any) =>
            `- ${item.name} x${item.quantity}: €${(
                item.price * item.quantity
            ).toFixed(2)}`
    )
    .join('\n')}

Totale: €${total.toFixed(2)}

Codice sconto: ${discountCode}
        `)

=======
        if (!cart.email) {
            return NextResponse.json({ error: 'Email non disponibile' }, { status: 400 })
        }

        // Simula invio email (in produzione userebbe un servizio email reale)
        const items = JSON.parse(cart.items || '[]')
        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

        // Crea codice sconto per incentivare il recupero
        const discountCode = `TORNA-${cart.id.slice(-6).toUpperCase()}`

        // Log dell'email che verrebbe inviata
        console.log(`
📧 EMAIL DI RECUPERO CARRELLO (Simulata)
----------------------------------------
A: ${cart.email}
Oggetto: Hai dimenticato qualcosa nel carrello! 🛒

Ciao!

Abbiamo notato che hai lasciato alcuni articoli nel carrello:

${items.map((item: any) => `- ${item.name} x${item.quantity}: €${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Totale: €${total.toFixed(2)}

Usa il codice sconto ${discountCode} per ottenere il 10% di sconto!

[Completa il tuo ordine]

A presto!
        `)

        // Aggiorna lo stato del carrello
>>>>>>> master
        await prisma.abandonedCart.update({
            where: { id },
            data: { reminderSent: true }
        })

<<<<<<< HEAD
        try {
            const promoClient = (prisma as any).promoCode
            if (promoClient && typeof promoClient.create === 'function') {
                await promoClient.create({
                    data: {
                        code: discountCode,
                        type: 'percentage',
                        value: 10,
                        minOrder: 0,
                        maxUses: 1,
                        usedCount: 0,
                        active: true,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                })
            } else {
                console.log('Codice sconto non salvato (modello non disponibile)')
            }
        } catch (err) {
            console.log('Errore salvataggio codice sconto:', err)
=======
        // Salva il codice sconto nel database (se il modello PromoCode esiste)
        try {
            await prisma.promoCode.create({
                data: {
                    code: discountCode,
                    type: 'percentage',
                    value: 10,
                    minOrder: 0,
                    maxUses: 1,
                    usedCount: 0,
                    active: true,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 giorni
                }
            })
        } catch (e) {
            // Il modello potrebbe non esistere
            console.log('Codice sconto non salvato (modello non disponibile)')
>>>>>>> master
        }

        return NextResponse.json({
            success: true,
            message: 'Email di recupero inviata',
            discountCode
        })
    } catch (error) {
        console.error('Errore invio email:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
