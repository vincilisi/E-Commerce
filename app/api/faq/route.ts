import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - FAQ pubbliche
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const all = searchParams.get('all') // Per admin
        
        const where: Record<string, unknown> = {}
        if (!all) where.active = true
        if (category) where.category = category
        
        const faqs = await prisma.fAQ.findMany({
            where,
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
        })
        
        // Raggruppa per categoria
        const grouped = faqs.reduce((acc, faq) => {
            if (!acc[faq.category]) acc[faq.category] = []
            acc[faq.category].push(faq)
            return acc
        }, {} as Record<string, typeof faqs>)
        
        return NextResponse.json({ faqs, grouped })
    } catch (error) {
        console.error('Errore FAQ:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Crea FAQ (admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { question, answer, category, order } = body
        
        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                category: category || 'generale',
                order: order || 0
            }
        })
        
        return NextResponse.json(faq, { status: 201 })
    } catch (error) {
        console.error('Errore creazione FAQ:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
