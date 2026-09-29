'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl p-5 sm:p-6 shadow-md">
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3"><Mail className="w-5 h-5 text-white" /></div>
      <h3 className="font-black text-lg text-white leading-snug">Daily News Bulletin</h3>
      <p className="text-xs text-red-100 mt-1 mb-4 leading-relaxed">Roz subah ki top 10 khabrein seedha aapke inbox me payein.</p>
      {subscribed ? (
        <div className="flex items-center gap-2 bg-white/20 p-3 rounded-xl text-xs font-semibold"><CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" /><span>Shukriya! Aap subscribe ho chuke hain.</span></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Apna email darj karein..." required className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white" />
          <button type="submit" className="w-full bg-gray-950 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-colors">Subscribe Now</button>
        </form>
      )}
    </div>
  );
}
