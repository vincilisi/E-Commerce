import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;

    const page = await prisma.legalPage.findUnique({
        where: { slug },
        select: { slug: true, title: true, content: true, active: true },
    });

    if (!page) {
        return {
            title: 'Pagina legale non trovata',
            robots: { index: false, follow: false },
        };
    }

    const description = page.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
    const canonical = `/legal/${page.slug}`;

    return {
        title: page.title,
        description,
        alternates: {
            canonical,
        },
        robots: page.active ? undefined : { index: false, follow: false },
        openGraph: {
            title: page.title,
            description,
            url: canonical,
            type: 'article',
        },
        twitter: {
            card: 'summary',
            title: page.title,
            description,
        },
    };
}

export default function LegalPageLayout({ children }: { children: React.ReactNode }) {
    return children;
}
