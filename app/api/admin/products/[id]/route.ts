import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                materials: true,
                tags: true
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, description, price, category, inStock, materials, dimensions, images, tags } = body;

        // Aggiorna i dati base del prodotto
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                inStock,
                dimensions,
            },
            include: {
                images: true,
                materials: true,
                tags: true
            }
        });

        // Aggiorna immagini, materiali e tag (semplice: elimina e ricrea)
        await prisma.productImage.deleteMany({ where: { productId: id } });
        await prisma.productMaterial.deleteMany({ where: { productId: id } });
        await prisma.productTag.deleteMany({ where: { productId: id } });

        if (images && images.length > 0) {
            await prisma.productImage.createMany({
                data: images.map((url: string) => ({ url, productId: id }))
            });
        }
        if (materials && materials.length > 0) {
            await prisma.productMaterial.createMany({
                data: materials.map((name: string) => ({ name, productId: id }))
            });
        }
        if (tags && tags.length > 0) {
            await prisma.productTag.createMany({
                data: tags.map((name: string) => ({ name, productId: id }))
            });
        }

        // Ritorna il prodotto aggiornato con relazioni
        const updatedProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                materials: true,
                tags: true
            }
        });

        return NextResponse.json({ product: updatedProduct });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nell\'aggiornamento' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nell\'eliminazione' }, { status: 500 });
    }
}
