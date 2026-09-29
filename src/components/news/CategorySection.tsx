import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Article } from '@/types/article';
import NewsCard from './NewsCard';

interface CategorySectionProps { title: string; slug: string; articles: Article[]; }

export default function CategorySection({ title, slug, articles }: CategorySectionProps) {
	if (!articles || articles.length === 0) return null;
	return (
		<section className="mb-12">
			<div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-gray-100 dark:border-gray-800"><div className="flex items-center gap-2"><span className="w-3 h-6 bg-red-600 rounded-sm inline-block" /><h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{title}</h2></div><Link href={`/category/${slug}`} className="flex items-center text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors group"><span>View All</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link></div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{articles.slice(0, 3).map((article) => <NewsCard key={article.id} article={article} />)}</div>
		</section>
	);
}
