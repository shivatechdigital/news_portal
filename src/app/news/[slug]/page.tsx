import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import api from '@/lib/api';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';
import ArticleShare from '@/components/article/ArticleShare';
import SourceCredit from '@/components/article/SourceCredit';
import RelatedArticles from '@/components/news/RelatedArticles';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ReadingProgress from '@/components/article/ReadingProgress';
import { Article } from '@/types/article';

// ISR: Har 60 second me page revalidate hoga
export const revalidate = 60;

async function getArticle(slug: string): Promise<Article> {
  try {
    const res = await api.get(`/api/articles/${slug}`);
    return res.data;
  } catch {
    notFound();
  }
}

// Dynamic SEO metadata per article
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  return {
    title: article.title,
    description: article.meta_description,
    keywords: `${article.category}, ${article.title.split(' ').slice(0, 5).join(', ')}`,
    openGraph: {
      title: article.title,
      description: article.meta_description,
      type: 'article',
      publishedTime: article.published_at,
      images: [{ url: article.image_url, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description,
      images: [article.image_url],
    },
    alternates: {
      canonical: `/news/${article.slug}`,
    },
  };
}

// Structured Data for Google News (JSON-LD)
function ArticleSchema({ article }: { article: Article }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.meta_description,
    image: [article.image_url],
    datePublished: article.published_at,
    dateModified: article.created_at,
    author: {
      '@type': 'Organization',
      name: 'NewsPortal',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NewsPortal',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/news/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  return (
    <>
      <ArticleSchema article={article} />
      <ReadingProgress />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: article.category, href: `/category/${article.category}` },
            { label: article.title },
          ]} 
        />
        
        <ArticleHeader article={article} />
        
        <ArticleBody content={article.content} />
        
        <ArticleShare 
          url={`/news/${article.slug}`} 
          title={article.title} 
        />
        
        <SourceCredit 
          sourceName={article.source_name} 
          sourceUrl={article.source_url} 
        />
      </article>
      
      <RelatedArticles 
        category={article.category} 
        currentSlug={article.slug} 
      />
    </>
  );
}
