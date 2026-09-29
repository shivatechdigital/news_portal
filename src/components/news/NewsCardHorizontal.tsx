import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '@/types/article';
import CategoryBadge from '../shared/CategoryBadge';

interface NewsCardHorizontalProps { article: Article; }

export default function NewsCardHorizontal({ article }: NewsCardHorizontalProps) {
	const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60';
	return (
		<article className="group bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4">
			<Link href={`/news/${article.slug}`} className="relative aspect-[16/10] sm:w-56 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"><Image src={article.image_url || fallbackImage} alt={article.title} fill sizes="(max-width: 640px) 100vw, 224px" className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized={Boolean(article.image_url)} /></Link>
			<div className="flex flex-col justify-between flex-1">
				<div><div className="flex items-center gap-2 mb-2"><CategoryBadge category={article.category} /><span className="text-xs text-gray-400">•</span><span className="text-xs text-gray-400 font-medium">{article.source_name}</span></div><Link href={`/news/${article.slug}`}><h2 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-2 group-hover:text-red-600 transition-colors mb-2">{article.title}</h2></Link><p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 hidden sm:block">{article.summary || article.meta_description}</p></div>
				<div className="flex items-center gap-2 text-xs text-gray-400 mt-3 pt-2 sm:pt-0 sm:border-0 border-t border-gray-100 dark:border-gray-800"><Clock className="w-3.5 h-3.5" /><span>{new Date(article.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}</span></div>
			</div>
		</article>
	);
}
