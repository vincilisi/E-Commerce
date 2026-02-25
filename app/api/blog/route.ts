import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Articoli blog
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const published = searchParams.get('published')
        const featured = searchParams.get('featured')
        const slug = searchParams.get('slug')

        if (slug) {
            const post = await prisma.blogPost.findUnique({
                where: { slug }
            })
            if (post) {
                // Incrementa visualizzazioni
                await prisma.blogPost.update({
                    where: { slug },
                    data: { views: { increment: 1 } }
                })
            }
            return NextResponse.json(post)
        }

        const where: Record<string, unknown> = {}
        if (published === 'true') where.published = true
        if (featured === 'true') where.featured = true

        const posts = await prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error('Errore blog:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// POST - Crea articolo (admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, content, excerpt, image, tags, published, featured } = body

        // Genera slug da titolo
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || content.substring(0, 160),
                image,
                tags: tags ? JSON.stringify(tags) : null,
                published: published || false,
                featured: featured || false
            }
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Errore creazione post:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
