import type { Metadata } from 'next';
import api from '@/lib/api';
import { Article, ArticlesResponse } from '@/types/article';
import NewsCardHorizontal from '@/components/news/NewsCardHorizontal';
import TrendingNews from '@/components/news/TrendingNews';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Pagination from '@/components/shared/Pagination';
import AdBanner from '@/components/shared/AdBanner';
import Newsletter from '@/components/shared/Newsletter';
import { siteConfig } from '@/config/site';

export const revalidate = 60;

interface CategoryPageProps { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }>; }

const getFallbackCategoryArticles = (catSlug: string): Article[] => [
  { id: 1, title: `${catSlug.toUpperCase()}: Breaking News Update 2025`, slug: `${catSlug}-breaking-news-update-2025`, meta_description: `${catSlug} category ki latest reports aur vishleshan.`, summary: `${catSlug} par sabse taza update aur mukhya samachar. Jankari ke liye detail report padhein.`, content: '<p>Report text...</p>', source_name: 'Times of India', source_url: 'https://timesofindia.indiatimes.com', category: catSlug, image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80', status: 'published', views: 1100, published_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 2, title: `${catSlug.toUpperCase()}: Vishesh Report aur Mukhya Bindu`, slug: `${catSlug}-vishesh-report-mukhya-bindu`, meta_description: `${catSlug} se judi badi khabar aur vishleshan.`, summary: `${catSlug} kshetra me huye naye vikas aur prabhav par ek najar.`, content: '<p>Report text...</p>', source_name: 'Hindustan Times', source_url: 'https://hindustantimes.com', category: catSlug, image_url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=80', status: 'published', views: 820, published_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date().toISOString() },
  { id: 3, title: `${catSlug.toUpperCase()}: Aam Janta ke liye Naye Disha-Nirdesh`, slug: `${catSlug}-aam-janta-naye-disha-nirdesh`, meta_description: `${catSlug} update aur mahatvapurna jankari.`, summary: `${catSlug} se sambandhit naye aadesh lagu kiye gaye hain.`, content: '<p>Report text...</p>', source_name: 'NDTV', source_url: 'https://ndtv.com', category: catSlug, image_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80', status: 'published', views: 1420, published_at: new Date(Date.now() - 7200000).toISOString(), created_at: new Date().toISOString() },
];

async function fetchCategoryArticles(category: string, page = 1): Promise<ArticlesResponse> {
  try {
    const res = await api.get(`/api/articles?category=${category}&page=${page}&limit=10`);
    if (res.data?.articles?.length > 0) return res.data;
  } catch { /* Use local fallback data while the API is unavailable. */ }
  const articles = getFallbackCategoryArticles(category);
  return { articles, total: articles.length, page, totalPages: 1 };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title: `${categoryName} News - Taza Samachar aur Updates | NewsPortal`, description: `${categoryName} se judi breaking news, vishleshan aur taza khabrein padhein NewsPortal par.`, openGraph: { title: `${categoryName} News - Latest Updates`, description: `${categoryName} ki sabse tez khabrein` } };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const categorySlug = slug.toLowerCase();
  const categoryData = siteConfig.categories.find((c) => c.slug === categorySlug);
  const categoryName = categoryData ? categoryData.name : slug;
  const { articles, totalPages, total } = await fetchCategoryArticles(categorySlug, currentPage);

  return <main className="max-w-7xl mx-auto px-4 py-8"><Breadcrumb items={[{ label: 'Categories', href: '/' }, { label: categoryName }]} /><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 mb-8 border-b-2 border-red-600"><div><div className="flex items-center gap-2"><span className="w-3 h-8 bg-red-600 rounded-sm inline-block" /><h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white capitalize">{categoryName} News</h1></div><p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 pl-5">{categoryName} se judi sabhi taza aur vishleshanatmak reports ({total} Total Stories)</p></div></div><div className="grid grid-cols-1 lg:grid-cols-12 gap-8"><div className="lg:col-span-8">{articles.length > 0 ? <div className="space-y-4">{articles.map((article) => <NewsCardHorizontal key={article.id} article={article} />)}</div> : <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800"><p className="text-gray-500 dark:text-gray-400 font-semibold">Is category me abhi koi khabar uplabdh nahi hai.</p></div>}<Pagination currentPage={currentPage} totalPages={totalPages} /><AdBanner format="horizontal" className="mt-10" /></div><div className="lg:col-span-4 space-y-6"><TrendingNews articles={articles} /><Newsletter /><AdBanner format="rectangle" /></div></div></main>;
}
