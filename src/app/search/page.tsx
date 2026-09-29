import type { Metadata } from 'next';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Article } from '@/types/article';
import NewsCardHorizontal from '@/components/news/NewsCardHorizontal';
import Breadcrumb from '@/components/shared/Breadcrumb';
import SearchBar from '@/components/shared/SearchBar';
import AdBanner from '@/components/shared/AdBanner';

interface SearchPageProps { searchParams: Promise<{ q?: string }>; }

export const metadata: Metadata = { title: 'Search News | NewsPortal', description: 'Search articles, breaking news, topics and current affairs.', robots: { index: false, follow: true } };

async function searchArticles(query: string): Promise<Article[]> {
  if (!query || query.trim() === '') return [];
  try {
    const res = await api.get('/api/articles?limit=20');
    const all = res.data?.articles || [];
    return all.filter((a: Article) => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()) || a.summary?.toLowerCase().includes(query.toLowerCase()));
  } catch { return []; }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';
  const results = await searchArticles(query);
  return <main className="max-w-5xl mx-auto px-4 py-8 min-h-[70vh]"><Breadcrumb items={[{ label: 'Home', href: '/' }, { label: `Search: "${query}"` }]} /><div className="max-w-2xl mx-auto mb-10 mt-4"><SearchBar /></div><div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200 dark:border-gray-800"><div className="flex items-center gap-2"><SearchIcon className="w-5 h-5 text-red-600" /><h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Search Results for: <span className="text-red-600 font-black">&quot;{query}&quot;</span></h1></div><span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{results.length} results found</span></div>{results.length > 0 ? <div className="space-y-4">{results.map((article) => <NewsCardHorizontal key={article.id} article={article} />)}</div> : <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 my-8"><AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" /><h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Koi parinam nahi mila</h2><p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">Aapne jo shabd khoja uske anuroop koi khabar nahi mili. Kripya doosra keyword ya spelling check karein.</p></div>}<AdBanner format="horizontal" className="mt-12" /></main>;
}
