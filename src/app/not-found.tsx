import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return <div className="min-h-[60vh] flex items-center justify-center px-4"><div className="max-w-md w-full text-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"><div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-600" /></div><h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">404</h1><h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">Page Nahi Mila (Story Not Found)</h2><p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">Aap jis khabar ya page ko dhoondh rahe hain wo shyd hata diya gaya hai ya uska URL badal gaya hai.</p><Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"><Home className="w-4 h-4" /><span>Home Page Par Jayein</span></Link></div></div>;
}
