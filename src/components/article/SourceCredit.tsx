import { ExternalLink, ShieldCheck } from 'lucide-react';

interface SourceCreditProps { sourceName?: string; sourceUrl?: string; }

export default function SourceCredit({ sourceName = 'Public News Wire', sourceUrl }: SourceCreditProps) {
  return <div className="bg-gray-100 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 mt-8"><div className="flex items-start gap-2.5"><ShieldCheck className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" /><div className="space-y-1"><p className="font-semibold text-gray-800 dark:text-gray-200">Source & Attribution Disclaimer:</p><p className="leading-relaxed">Ye samachar publicly available news media se verify karke publish kiya gaya hai. Mul lekh aur vishesh koshish ka shrey original publisher ko jata hai.</p>{sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline mt-1 pt-1"><span>Original report padhein ({sourceName})</span><ExternalLink className="w-3 h-3" /></a>}</div></div></div>;
}
