import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '@/types/article';
import CategoryBadge from '../shared/CategoryBadge';

interface HeroSectionProps { articles: Article[]; }

export default function HeroSection({ articles }: HeroSectionProps) {
	if (!articles || articles.length === 0) return null;
	const leadArticle = articles[0];
	const subArticles = articles.slice(1, 5);
	const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=60';

	return (
		<section className="mb-10">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{leadArticle && <div className="lg:col-span-7"><article className="group relative rounded-2xl overflow-hidden bg-gray-900 aspect-[16/10] sm:aspect-[16/11] lg:h-full min-h-[360px] flex flex-col justify-end p-5 sm:p-8"><Image src={leadArticle.image_url || fallbackImage} alt={leadArticle.title} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.75]" unoptimized={Boolean(leadArticle.image_url)} /><div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" /><div className="relative z-10"><CategoryBadge category={leadArticle.category} size="md" className="mb-3" /><Link href={`/news/${leadArticle.slug}`}><h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight group-hover:text-red-400 transition-colors mb-3">{leadArticle.title}</h1></Link><p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-4 max-w-2xl leading-relaxed hidden sm:block">{leadArticle.summary || leadArticle.meta_description}</p><div className="flex items-center gap-3 text-xs text-gray-300"><span className="font-semibold text-white">{leadArticle.source_name}</span><span>•</span><div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{new Date(leadArticle.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}</span></div></div></div></article></div>}
				<div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">{subArticles.map((article) => <article key={article.id} className="group relative rounded-xl overflow-hidden bg-gray-900 aspect-[16/10] sm:aspect-auto sm:min-h-[170px] p-4 flex flex-col justify-end"><Image src={article.image_url || fallbackImage} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.70]" unoptimized={Boolean(article.image_url)} /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" /><div className="relative z-10"><CategoryBadge category={article.category} className="mb-2" /><Link href={`/news/${article.slug}`}><h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">{article.title}</h3></Link></div></article>)}</div>
			</div>
		</section>
	);
}
