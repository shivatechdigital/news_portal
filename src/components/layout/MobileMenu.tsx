'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface MobileMenuProps { onClose: () => void; }

export default function MobileMenu({ onClose }: MobileMenuProps) {
	const pathname = usePathname();
	const allLinks = [
		{ name: 'Home', slug: '/' },
		...siteConfig.categories.map((c) => ({ name: c.name, slug: `/category/${c.slug}` })),
		{ name: 'About', slug: '/about' },
		{ name: 'Contact', slug: '/contact' },
	];

	return (
		<div className="fixed inset-0 z-[100] lg:hidden">
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
			<div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-left duration-300">
				<div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
					<div className="flex items-center gap-2"><div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><span className="text-white font-black">N</span></div><span className="font-bold text-lg">News<span className="text-red-600">Portal</span></span></div>
					<button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
				</div>
				<nav className="p-3 overflow-y-auto h-[calc(100%-80px)]">
					{allLinks.map((link) => {
						const isActive = link.slug === '/' ? pathname === '/' : pathname.startsWith(link.slug);
						return <Link key={link.slug} href={link.slug} onClick={onClose} className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${isActive ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}><span className="text-base">{link.name}</span><ChevronRight className="w-4 h-4 text-gray-400" /></Link>;
					})}
				</nav>
			</div>
		</div>
	);
}
