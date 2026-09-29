import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';

interface NewsCardCompactProps { article: Article; }

export default function NewsCardCompact({ article }: NewsCardCompactProps) {
	const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=60';
	return (
		<article className="group flex gap-3 items-center py-2.5">
			<Link href={`/news/${article.slug}`} className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"><Image src={article.image_url || fallbackImage} alt={article.title} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized={Boolean(article.image_url)} /></Link>
			<div className="flex-1 min-w-0"><Link href={`/news/${article.slug}`}><h4 className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">{article.title}</h4></Link><span className="text-[11px] text-gray-400 mt-1 block">{new Date(article.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}</span></div>
		</article>
	);
}
