'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useActiveCategories } from '@/hooks/useActiveCategories';

const footerLinks = {
	company: [
		{ name: 'About Us', href: '/about' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Advertise', href: '/contact' },
		{ name: 'Careers', href: '/contact' },
	],
	legal: [
		{ name: 'Privacy Policy', href: '/privacy-policy' },
		{ name: 'Terms of Service', href: '/terms' },
		{ name: 'Disclaimer', href: '/terms' },
		{ name: 'Cookie Policy', href: '/privacy-policy' },
	],
};

export default function Footer() {
	const activeCategories = useActiveCategories();
	return (
		<footer className="bg-gray-900 dark:bg-black text-gray-300 mt-16">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="sm:col-span-2 lg:col-span-1">
						<Link href="/" className="flex items-center gap-2 mb-4"><div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center"><span className="text-white font-black text-lg">N</span></div><span className="text-xl font-black text-white">News<span className="text-red-500">Portal</span></span></Link>
						<p className="text-sm text-gray-400 leading-relaxed mb-4">India ki sabse tez aur reliable news website. Har khabar, har update, sabse pehle aap tak.</p>
						<div className="flex gap-3">{['Twitter', 'Facebook', 'YouTube', 'Instagram'].map((social) => <a key={social} href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold" aria-label={social}>{social[0]}</a>)}</div>
					</div>
					<div><h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Categories</h3><ul className="space-y-2.5">{activeCategories.map((cat) => <li key={cat.slug}><Link href={`/category/${cat.slug}`} className="text-sm hover:text-red-400 transition-colors">{cat.name}</Link></li>)}</ul></div>
					<div><h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h3><ul className="space-y-2.5">{footerLinks.company.map((link) => <li key={link.name}><Link href={link.href} className="text-sm hover:text-red-400 transition-colors">{link.name}</Link></li>)}</ul></div>
					<div><h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h3><ul className="space-y-2.5">{footerLinks.legal.map((link) => <li key={link.name}><Link href={link.href} className="text-sm hover:text-red-400 transition-colors">{link.name}</Link></li>)}</ul></div>
				</div>
			</div>
			<div className="border-t border-gray-800"><div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"><p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p><p>Some news content sourced from public RSS feeds. All trademarks belong to their respective owners.</p></div></div>
		</footer>
	);
}
