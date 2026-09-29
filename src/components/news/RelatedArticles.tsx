import { Article } from '@/types/article';
import NewsCard from './NewsCard';

interface RelatedArticlesProps { category: string; currentSlug: string; articles: Article[]; }

export default function RelatedArticles({ category, currentSlug, articles }: RelatedArticlesProps) {
	const related = articles.filter((a) => a.slug !== currentSlug).slice(0, 3);
	if (related.length === 0) return null;
	return <section data-category={category} className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800"><div className="flex items-center gap-2 mb-6"><span className="w-3 h-6 bg-red-600 rounded-sm inline-block" /><h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Yeh Bhi Padhein (Related Stories)</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{related.map((item) => <NewsCard key={item.id} article={item} />)}</div></section>;
}
