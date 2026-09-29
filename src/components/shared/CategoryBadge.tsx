'use client';

import Link from 'next/link';

interface CategoryBadgeProps {
	category: string;
	className?: string;
	size?: 'sm' | 'md';
}

const categoryColors: Record<string, string> = {
	india: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
	world: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
	business: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
	sports: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
	tech: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
	entertainment: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
	local: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
};

export default function CategoryBadge({ category, className = '', size = 'sm' }: CategoryBadgeProps) {
	const normalizedCategory = category?.toLowerCase() || 'general';
	const colorClass = categoryColors[normalizedCategory] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
	const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1 font-semibold';

	return <Link href={`/category/${normalizedCategory}`} className={`inline-flex items-center uppercase tracking-wider font-bold rounded-md border transition-colors hover:opacity-80 ${colorClass} ${sizeClass} ${className}`} onClick={(e) => e.stopPropagation()}>{category}</Link>;
}
