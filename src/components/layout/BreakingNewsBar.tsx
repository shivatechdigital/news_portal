'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';

interface BreakingNews {
	id: number;
	title: string;
	slug: string;
}

const demoBreakingNews: BreakingNews[] = [
	{ id: 1, title: 'Lok Sabha me aaj pesh hoga naya Education Bill', slug: 'lok-sabha-education-bill' },
	{ id: 2, title: 'Sensex 1000 points upar, Nifty ne chhua naya record', slug: 'sensex-nifty-record' },
	{ id: 3, title: 'Delhi me aaj se naye traffic rules lagu', slug: 'delhi-traffic-rules' },
	{ id: 4, title: 'ISRO ka naya mission: Chandrayaan-4 ki taiyari shuru', slug: 'isro-chandrayaan-4' },
];

export default function BreakingNewsBar() {
	const [isVisible, setIsVisible] = useState(true);
	const [breakingNews] = useState<BreakingNews[]>(demoBreakingNews);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (breakingNews.length === 0) return;
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [breakingNews.length]);

	if (!isVisible || breakingNews.length === 0) return null;

	return (
		<div className="bg-red-600 text-white text-sm relative overflow-hidden">
			<div className="max-w-7xl mx-auto flex items-center">
				<div className="bg-red-800 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10">
					<AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
					<span className="font-bold uppercase tracking-wider text-xs">Breaking</span>
				</div>
				<div className="flex-1 overflow-hidden py-1.5 px-4">
					<Link
						href={`/news/${breakingNews[currentIndex]?.slug}`}
						className="block truncate hover:underline transition-all duration-500"
						key={breakingNews[currentIndex]?.id}
					>
						{breakingNews[currentIndex]?.title}
					</Link>
				</div>
				<div className="hidden sm:flex items-center gap-1 pr-2">
					{breakingNews.map((_, i) => (
						<button
							key={i}
							onClick={() => setCurrentIndex(i)}
							className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`}
						/>
					))}
				</div>
				<button
					onClick={() => setIsVisible(false)}
					className="p-1.5 hover:bg-red-700 transition-colors shrink-0"
					aria-label="Close breaking news"
				>
					<X className="w-3.5 h-3.5" />
				</button>
			</div>
		</div>
	);
}
