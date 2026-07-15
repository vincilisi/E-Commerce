import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            images: { select: { url: true }, take: 1 },
            category: true,
        },
    });

    if (!product) {
        return {
            title: 'Prodotto non trovato',
            robots: { index: false, follow: false },
        };
    }

    const description = product.description.slice(0, 160);
    const canonical = `/prodotti/${product.id}`;
    const imageUrl = product.images[0]?.url;

    return {
        title: product.name,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title: product.name,
            description,
            url: canonical,
            type: 'website',
            images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
        },
        twitter: {
            card: imageUrl ? 'summary_large_image' : 'summary',
            title: product.name,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return children;
}
