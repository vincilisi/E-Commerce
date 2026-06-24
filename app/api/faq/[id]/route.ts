export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Modifica FAQ
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await request.json()
        const { question, answer, category, order, active } = body

        const updateData: Record<string, unknown> = {}
        if (question !== undefined) updateData.question = question
        if (answer !== undefined) updateData.answer = answer
        if (category !== undefined) updateData.category = category
        if (order !== undefined) updateData.order = order
        if (active !== undefined) updateData.active = active

        const faq = await prisma.fAQ.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(faq)
    } catch (error) {
        console.error('Errore modifica FAQ:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// DELETE - Elimina FAQ
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        await prisma.fAQ.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'FAQ eliminata' })
    } catch (error) {
        console.error('Errore eliminazione FAQ:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
