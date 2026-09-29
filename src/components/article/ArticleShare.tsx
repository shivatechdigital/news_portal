'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ArticleShareProps { url: string; title: string; }

export default function ArticleShare({ url, title }: ArticleShareProps) {
	const [copied, setCopied] = useState(false);
	const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
	const handleCopy = () => { navigator.clipboard.writeText(fullUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
	const shareLinks = [
		{ name: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + fullUrl)}`, bg: 'bg-emerald-500 hover:bg-emerald-600' },
		{ name: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`, bg: 'bg-black hover:bg-gray-800' },
		{ name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, bg: 'bg-blue-600 hover:bg-blue-700' },
	];

	return <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 my-8 border border-gray-100 dark:border-gray-800"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div className="flex items-center gap-2"><Share2 className="w-4 h-4 text-red-600" /><span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Share this news</span></div><div className="flex items-center gap-2">{shareLinks.map((item) => <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors ${item.bg}`}>{item.name}</a>)}<button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-colors">{copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}<span>{copied ? 'Copied' : 'Copy'}</span></button></div></div></div>;
}
