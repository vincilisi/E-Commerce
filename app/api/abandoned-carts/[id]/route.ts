import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Aggiorna stato carrello
export async function PUT(
    request: NextRequest,
    context: { params: { id: string } | Promise<{ id: string }> }
) {
    try {
        const rawParams = context.params
        const { id } = rawParams instanceof Promise ? await rawParams : rawParams

        const body = await request.json()
        const { reminderSent, recovered, email } = body

        const updateData: Record<string, unknown> = {}
        if (reminderSent !== undefined) updateData.reminderSent = reminderSent
        if (recovered !== undefined) updateData.recovered = recovered
        if (email !== undefined) updateData.email = email

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
    context: { params: { id: string } | Promise<{ id: string }> }
) {
    try {
        const rawParams = context.params
        const { id } = rawParams instanceof Promise ? await rawParams : rawParams

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
    context: { params: { id: string } | Promise<{ id: string }> }
) {
    try {
        const rawParams = context.params
        const { id } = rawParams instanceof Promise ? await rawParams : rawParams

        const cart = await prisma.abandonedCart.findUnique({
            where: { id }
        })

        if (!cart) {
            return NextResponse.json({ error: 'Carrello non trovato' }, { status: 404 })
        }

        if (!(cart as any).email) {
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
A: ${(cart as any).email}
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

        await prisma.abandonedCart.update({
            where: { id },
            data: { reminderSent: true }
        })

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
