import type { Article } from '@/types/article';
import { Eye, Calendar, BookOpen } from 'lucide-react';
import CategoryBadge from '../shared/CategoryBadge';

export default function ArticleHeader({ article }: { article: Article }) {
	const wordsCount = article.content?.replace(/<[^>]*>/g, '').split(' ').length || 200;
	const readingTime = Math.ceil(wordsCount / 180);

	return <header className="mb-6"><div className="flex items-center gap-2 mb-3"><CategoryBadge category={article.category} size="md" /><span className="text-xs text-gray-400">•</span><span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Source: {article.source_name || 'News Portal'}</span></div><h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-4">{article.title}</h1>{article.summary && <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">{article.summary}</p>}<div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400"><div className="flex items-center gap-4"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-red-600" /><time dateTime={article.published_at}>{new Date(article.published_at).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time></div><div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /><span>{readingTime} min read</span></div></div>{article.views > 0 && <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /><span>{article.views.toLocaleString()} views</span></div>}</div></header>;
}
