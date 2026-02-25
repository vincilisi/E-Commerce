
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Schema di validazione Zod
        const productSchema = z.object({
            name: z.string().min(2).max(100),
            description: z.string().min(5).max(1000),
            price: z.preprocess((v) => Number(v), z.number().min(0)),
            category: z.string().min(2).max(50),
            inStock: z.boolean().optional(),
            dimensions: z.string().max(100).optional(),
            images: z.array(z.string().url()).optional(),
            materials: z.array(z.string().min(1).max(50)).optional(),
            tags: z.array(z.string().min(1).max(30)).optional()
        });

        const parsed = productSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });
        }
        const { name, description, price, category, inStock, materials, dimensions, images, tags } = parsed.data;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                inStock: inStock ?? true,
                dimensions,
                images: images && images.length > 0 ? {
                    create: images.map((url: string) => ({ url }))
                } : undefined,
                materials: materials && materials.length > 0 ? {
                    create: materials.map((name: string) => ({ name }))
                } : undefined,
                tags: tags && tags.length > 0 ? {
                    create: tags.map((name: string) => ({ name }))
                } : undefined
            },
            include: {
                images: true,
                materials: true,
                tags: true
            }
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Errore nella creazione' }, { status: 500 });
    }
}
