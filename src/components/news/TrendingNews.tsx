import Link from 'next/link';
import { Flame } from 'lucide-react';
import { Article } from '@/types/article';

interface TrendingNewsProps { articles: Article[]; }

export default function TrendingNews({ articles }: TrendingNewsProps) {
	if (!articles || articles.length === 0) return null;
	return (
		<div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
			<div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800"><Flame className="w-5 h-5 text-red-600 fill-red-500 animate-bounce" /><h3 className="font-bold text-gray-900 dark:text-white text-base uppercase tracking-wider">Trending News</h3></div>
			<div className="space-y-4">{articles.slice(0, 5).map((article, idx) => <div key={article.id} className="group flex items-start gap-3.5"><span className="font-black text-2xl sm:text-3xl text-gray-200 dark:text-gray-800 group-hover:text-red-500 transition-colors shrink-0 w-6">0{idx + 1}</span><div className="flex-1"><Link href={`/news/${article.slug}`}><h4 className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">{article.title}</h4></Link><div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1"><span>{article.category}</span><span>•</span><span>{new Date(article.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}</span></div></div></div>)}</div>
		</div>
	);
}
