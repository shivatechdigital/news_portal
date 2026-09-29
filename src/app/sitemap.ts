import { MetadataRoute } from 'next';
import api from '@/lib/api';
import type { Article } from '@/types/article';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), priority: 0.3 },
  ];

  // Dynamic article pages
  try {
    const res = await api.get('/api/articles?limit=5000');
    const articlePages = res.data.articles.map((article: Article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...articlePages];
  } catch {
    return staticPages;
  }
}
