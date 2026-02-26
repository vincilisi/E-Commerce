export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Singolo post
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const post = await prisma.blogPost.findUnique({
            where: { id }
        })

        if (!post) {
            return NextResponse.json({ error: 'Post non trovato' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('Errore:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// PUT - Modifica post
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await request.json()
        const { title, content, excerpt, image, tags, published, featured } = body

        const updateData: Record<string, unknown> = {}
        if (title !== undefined) {
            updateData.title = title
            updateData.slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
        }
        if (content !== undefined) updateData.content = content
        if (excerpt !== undefined) updateData.excerpt = excerpt
        if (image !== undefined) updateData.image = image
        if (tags !== undefined) updateData.tags = JSON.stringify(tags)
        if (published !== undefined) updateData.published = published
        if (featured !== undefined) updateData.featured = featured

        const post = await prisma.blogPost.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('Errore modifica post:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}

// DELETE - Elimina post
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        await prisma.blogPost.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Post eliminato' })
    } catch (error) {
        console.error('Errore eliminazione post:', error)
        return NextResponse.json({ error: 'Errore server' }, { status: 500 })
    }
}
