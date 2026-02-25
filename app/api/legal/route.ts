import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Pagine legali
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (slug) {
            const page = await prisma.legalPage.findUnique({
                where: { slug }
            })
            return NextResponse.json(page)
        }

        const pages = await prisma.legalPage.findMany({
            where: { active: true }
        })

        return NextResponse.json(pages)
    } catch (error) {
        console.error('Errore pagine legali:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Crea/Aggiorna pagina (admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { slug, title, content } = body

        const page = await prisma.legalPage.upsert({
            where: { slug },
            update: { title, content },
            create: { slug, title, content }
        })

        return NextResponse.json(page)
    } catch (error) {
        console.error('Errore pagina legale:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
