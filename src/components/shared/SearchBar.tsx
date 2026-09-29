'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

interface SearchBarProps { onClose?: () => void; }

export default function SearchBar({ onClose }: SearchBarProps) {
	const [query, setQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => { inputRef.current?.focus(); }, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			onClose?.();
		}
	};

	return (
		<form onSubmit={handleSearch} className="relative">
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
			<input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="News search karein... (e.g. Budget 2025, IPL)" className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
			<button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"><ArrowRight className="w-4 h-4" /></button>
		</form>
	);
}
