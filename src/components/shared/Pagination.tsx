'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps { currentPage: number; totalPages: number; }

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	if (totalPages <= 1) return null;

	const createPageURL = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};
	const handlePageChange = (page: number) => router.push(createPageURL(page));
	const getPageNumbers = () => {
		const delta = 2;
		const range: number[] = [];
		for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) range.push(i);
		if (currentPage - delta > 2) range.unshift(-1);
		if (currentPage + delta < totalPages - 1) range.push(-2);
		range.unshift(1);
		if (totalPages > 1) range.push(totalPages);
		return range;
	};

	return <div className="flex items-center justify-center gap-1.5 mt-10"><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Peeche</span></button>{getPageNumbers().map((page, index) => page < 0 ? <span key={`ellipsis-${index}`} className="px-2 py-2 text-xs text-gray-400 font-bold">...</span> : <button key={page} onClick={() => handlePageChange(page)} className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${page === currentPage ? 'bg-red-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{page}</button>)}<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"><span className="hidden sm:inline">Aage</span><ChevronRight className="w-4 h-4" /></button></div>;
}
