'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('App Error Caught:', error); }, [error]);
  return <div className="min-h-[60vh] flex items-center justify-center px-4"><div className="max-w-md w-full text-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"><div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertOctagon className="w-8 h-8 text-red-600" /></div><h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Kuch Takniki Samasya Aa Gayi</h2><p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">Server se data load karne me samasya aayi hai. Kripya page ko refresh karke dobara koshish karein.</p><button onClick={() => reset()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"><RefreshCw className="w-4 h-4" /><span>Dobara Try Karein</span></button></div></div>;
}
