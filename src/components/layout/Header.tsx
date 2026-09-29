'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Sun, Moon, TrendingUp } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchBar from '../shared/SearchBar';
import { siteConfig } from '@/config/site';

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const storedTheme = window.localStorage.getItem('newsportal-theme');
		const dark = storedTheme === 'dark';
		setIsDarkMode(dark);
		document.documentElement.classList.toggle('dark', dark);
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDarkMode);
		window.localStorage.setItem('newsportal-theme', isDarkMode ? 'dark' : 'light');
	}, [isDarkMode]);

	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
		return () => { document.body.style.overflow = ''; };
	}, [isMobileMenuOpen]);

	const navLinks = siteConfig.categories.slice(0, 6);

	return (
		<>
			<div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hidden md:block">
				<div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-1.5 text-xs text-gray-500 dark:text-gray-400">
					<span>{new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
					<div className="flex items-center gap-1.5">
						<TrendingUp className="w-3 h-3 text-red-500" />
						<span className="font-medium text-gray-700 dark:text-gray-300">Trending:</span>
						<Link href="/news/lok-sabha-education-bill" className="text-red-600 hover:underline font-medium">Education Bill 2025</Link>
					</div>
				</div>
			</div>

			<header className={`sticky top-0 z-50 bg-white dark:bg-gray-900 transition-shadow duration-300 ${isScrolled ? 'shadow-lg border-b border-gray-100 dark:border-gray-800' : 'shadow-sm'}`}>
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-3">
							<button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Open menu"><Menu className="w-6 h-6" /></button>
							<Link href="/" className="flex items-center gap-2 shrink-0">
								<div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center"><span className="text-white font-black text-lg">N</span></div>
								<div className="hidden sm:block"><h1 className="text-xl font-black text-gray-900 dark:text-white leading-none">News<span className="text-red-600">Portal</span></h1><p className="text-[10px] text-gray-400 -mt-0.5 tracking-wider uppercase">Sabse Tez Khabar</p></div>
							</Link>
						</div>

						<nav className="hidden lg:flex items-center gap-1">
							<Link href="/" className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${pathname === '/' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Home</Link>
							{navLinks.map((cat) => <Link key={cat.slug} href={`/category/${cat.slug}`} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${pathname === `/category/${cat.slug}` ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{cat.name}</Link>)}
						</nav>

						<div className="flex items-center gap-1">
							<button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Search">{isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}</button>
							<button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle dark mode">{isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}</button>
						</div>
					</div>
					{isSearchOpen && <div className="pb-4 animate-in slide-in-from-top-2 duration-200"><SearchBar onClose={() => setIsSearchOpen(false)} /></div>}
				</div>
			</header>
			{isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
		</>
	);
}
