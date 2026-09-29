import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import AdBanner from '../shared/AdBanner';

interface ArticleBodyProps { content: string; imageUrl?: string; title: string; summary?: string; }

export default function ArticleBody({ content, imageUrl, title, summary }: ArticleBodyProps) {
	const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';
	return <div className="space-y-6"><figure className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm"><Image src={imageUrl || fallbackImage} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" unoptimized={Boolean(imageUrl)} /></figure>{summary && <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5"><div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-400 font-bold text-sm"><Sparkles className="w-4 h-4" /><span>Mukhya Baatein (Key Highlights)</span></div><p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p></div>}<div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 [&>p]:text-base [&>p]:sm:text-lg [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-2" dangerouslySetInnerHTML={{ __html: content }} /><AdBanner format="horizontal" className="my-8" /></div>;
}
