import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${siteUrl}/`, changeFrequency: 'daily', priority: 1 },
        { url: `${siteUrl}/prodotti`, changeFrequency: 'daily', priority: 0.9 },
        { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${siteUrl}/faq`, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${siteUrl}/chi-siamo`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${siteUrl}/contatti`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${siteUrl}/carrello`, changeFrequency: 'weekly', priority: 0.4 },
        { url: `${siteUrl}/checkout`, changeFrequency: 'weekly', priority: 0.4 },
        { url: `${siteUrl}/traccia-ordine`, changeFrequency: 'monthly', priority: 0.3 },
    ];

    try {
        const [products, blogPosts, legalPages] = await Promise.all([
            prisma.product.findMany({ select: { id: true, updatedAt: true } }),
            prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
            prisma.legalPage.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
        ]);

        const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
            url: `${siteUrl}/prodotti/${product.id}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
            url: `${siteUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        const legalRoutes: MetadataRoute.Sitemap = legalPages.map((page) => ({
            url: `${siteUrl}/legal/${page.slug}`,
            lastModified: page.updatedAt,
            changeFrequency: 'yearly',
            priority: 0.4,
        }));

        return [...staticRoutes, ...productRoutes, ...blogRoutes, ...legalRoutes];
    } catch (error) {
        console.error('Errore generazione sitemap:', error);
        return staticRoutes;
    }
}
