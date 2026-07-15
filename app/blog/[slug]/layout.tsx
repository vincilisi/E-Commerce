import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: {
            slug: true,
            title: true,
            excerpt: true,
            content: true,
            image: true,
            published: true,
        },
    });

    if (!post) {
        return {
            title: 'Articolo non trovato',
            robots: { index: false, follow: false },
        };
    }

    const description = (post.excerpt || post.content).slice(0, 160);
    const canonical = `/blog/${post.slug}`;

    return {
        title: post.title,
        description,
        alternates: {
            canonical,
        },
        robots: post.published ? undefined : { index: false, follow: false },
        openGraph: {
            title: post.title,
            description,
            url: canonical,
            type: 'article',
            images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
        },
        twitter: {
            card: post.image ? 'summary_large_image' : 'summary',
            title: post.title,
            description,
            images: post.image ? [post.image] : undefined,
        },
    };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
    return children;
}
