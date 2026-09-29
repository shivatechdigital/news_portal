import type { Metadata } from 'next';
import api from '@/lib/api';
import { Article } from '@/types/article';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ReadingProgress from '@/components/article/ReadingProgress';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';
import ArticleShare from '@/components/article/ArticleShare';
import SourceCredit from '@/components/article/SourceCredit';
import RelatedArticles from '@/components/news/RelatedArticles';

export const revalidate = 60;

const demoArticle: Article = {
  id: 1,
  title: 'Lok Sabha Chunav 2025: Naye Niyam aur Karyakram ki Ghoshna',
  slug: 'lok-sabha-chunav-2025-naye-niyam',
  meta_description: 'Chunav Aayog ne aane wale lok sabha chunav ke liye naye guidelines jari kar diye hain.',
  summary: 'Chunav Aayog ne digital voting aur EVM monitoring ke naye niyam lagoo kiye hain. Senior citizens ke liye ghar se voting ki suvidha badhai gayi hai.',
  content: '<p>Chunav Aayog (ECI) ne aaj ek press conference ke dauran aane wale chunav ke liye naye niyamavali jari ki hai. Is naye framework ka mukhya uddeshya chunav prakriya ko aur adhik transparent banana hai.</p><h2>Digital Monitoring aur Suraksha</h2><p>Har polling booth par high-definition CCTV cameras lagaye jayenge jinka seedha control room state headquarters me hoga. Iske alawa, biometric verification systems ko bhi pilot project ke roop me test kiya jayega.</p><h2>Matdatao ke liye Nayi Suvidhayein</h2><p>Varisth nagriko aur divyang voters ke liye special queue aur pick-up facilities uplabdh karwayi jayegi. Voter Helpline App me bhi naye features jode gaye hain.</p>',
  source_name: 'Times of India',
  source_url: 'https://timesofindia.indiatimes.com',
  category: 'india',
  image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
  status: 'published',
  views: 2450,
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

async function getArticleData(slug: string): Promise<Article> {
  try {
    const res = await api.get(`/api/articles/${slug}`);
    if (res.data) return res.data;
    return demoArticle;
  } catch {
    return demoArticle;
  }
}

async function getRelatedArticles(category: string): Promise<Article[]> {
  try {
    const res = await api.get(`/api/articles?category=${category}&limit=4`);
    return res.data?.articles || [demoArticle];
  } catch {
    return [demoArticle];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleData(slug);
  return {
    title: `${article.title} | NewsPortal`,
    description: article.meta_description || article.summary,
    openGraph: { title: article.title, description: article.meta_description || article.summary, url: `/news/${article.slug}`, type: 'article', publishedTime: article.published_at, images: [{ url: article.image_url || '/images/og-default.jpg', width: 1200, height: 630, alt: article.title }] },
    twitter: { card: 'summary_large_image', title: article.title, description: article.meta_description || article.summary, images: [article.image_url || '/images/og-default.jpg'] },
  };
}

export default async function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleData(slug);
  const relatedArticles = await getRelatedArticles(article.category);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image_url],
    datePublished: article.published_at,
    dateModified: article.created_at,
    description: article.meta_description || article.summary,
    publisher: { '@type': 'Organization', name: 'NewsPortal', logo: { '@type': 'ImageObject', url: 'https://yourdomain.com/images/logo.png' } },
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ReadingProgress /><main className="max-w-4xl mx-auto px-4 py-8"><Breadcrumb items={[{ label: article.category, href: `/category/${article.category}` }, { label: article.title }]} /><article><ArticleHeader article={article} /><ArticleBody content={article.content} imageUrl={article.image_url} title={article.title} summary={article.summary} /><ArticleShare url={`/news/${article.slug}`} title={article.title} /><SourceCredit sourceName={article.source_name} sourceUrl={article.source_url} /></article><RelatedArticles category={article.category} currentSlug={article.slug} articles={relatedArticles} /></main></>;
}
