import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem { label: string; href?: string; }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
	return <nav aria-label="Breadcrumb" className="mb-4"><ol className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500 dark:text-gray-400"><li><Link href="/" className="flex items-center gap-1 hover:text-red-600 transition-colors"><Home className="w-3.5 h-3.5" /><span>Home</span></Link></li>{items.map((item, index) => <li key={index} className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-gray-400" />{item.href ? <Link href={item.href} className="hover:text-red-600 uppercase font-medium transition-colors">{item.label}</Link> : <span className="text-gray-800 dark:text-gray-200 font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">{item.label}</span>}</li>)}</ol></nav>;
}
