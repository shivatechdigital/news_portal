import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { Article } from '@/types/article';
import CategoryBadge from '../shared/CategoryBadge';

interface NewsCardProps { article: Article; }

export default function NewsCard({ article }: NewsCardProps) {
	const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60';
	const timeAgo = (dateString: string) => {
		const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
		if (diff < 60) return `${diff}m pehle`;
		if (diff < 1440) return `${Math.floor(diff / 60)}h pehle`;
		return `${Math.floor(diff / 1440)}d pehle`;
	};

	return (
		<article className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
			<Link href={`/news/${article.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
				<Image src={article.image_url || fallbackImage} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" unoptimized={Boolean(article.image_url)} />
				<div className="absolute top-3 left-3 z-10"><CategoryBadge category={article.category} /></div>
			</Link>
			<div className="p-4 flex flex-col flex-1">
				<Link href={`/news/${article.slug}`} className="group-hover:text-red-600 transition-colors"><h2 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-2 leading-snug mb-2">{article.title}</h2></Link>
				<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed flex-1">{article.summary || article.meta_description}</p>
				<div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
					<div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /><span>{timeAgo(article.published_at)}</span></div>
					<div className="flex items-center gap-3">{article.source_name && <span className="font-medium text-gray-500 dark:text-gray-400">{article.source_name}</span>}{article.views > 0 && <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /><span>{article.views}</span></div>}</div>
				</div>
			</div>
		</article>
	);
}
