import type { Metadata } from 'next';
import { Award, Zap, Users, ShieldCheck } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = { title: 'About Us | NewsPortal', description: `Janiye ${siteConfig.name} ke mission aur editorial process ke bare me.` };

export default function AboutPage() {
  const highlights = [
    { icon: <Zap className="w-6 h-6 text-red-600" />, title: 'Sabse Tez Update', desc: 'Desh aur duniya ki har badi khabar bina kisi deri ke seedha aap tak.' },
    { icon: <ShieldCheck className="w-6 h-6 text-red-600" />, title: 'Fair & Verified', desc: 'Tathyo aur sroto ki pushti karke hi samachar prastut kiya jata hai.' },
    { icon: <Users className="w-6 h-6 text-red-600" />, title: 'Reader Centric', desc: 'Clean, fast loading aur bina kisi bulky clutter ka anubhav.' },
    { icon: <Award className="w-6 h-6 text-red-600" />, title: 'Modern Tech Stack', desc: 'Next.js aur AI-assisted editorial workflows dwara sanchalit.' },
  ];

  return <main className="max-w-4xl mx-auto px-4 py-8"><Breadcrumb items={[{ label: 'About Us' }]} /><div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm"><div className="text-center max-w-2xl mx-auto mb-10"><span className="text-xs font-black tracking-widest text-red-600 uppercase">Hamara Lakshya</span><h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1 mb-4">Naye Bharat Ki Nayi Awaaz</h1><p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{siteConfig.name} ek agraganya digital news media portal hai jiska uddeshya pathako tak satya, nishpaksh aur saral bhasha me samachar pahunchana hai.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">{highlights.map((item, idx) => <div key={idx} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 flex gap-4 items-start"><div className="p-2.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm shrink-0">{item.icon}</div><div><h3 className="font-bold text-gray-900 dark:text-white text-base">{item.title}</h3><p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p></div></div>)}</div><div className="border-t border-gray-100 dark:border-gray-800 pt-8 text-sm text-gray-600 dark:text-gray-300 space-y-4"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Editorial Policy &amp; Transparency</h2><p>Hum automated AI technology aur human journalism ke sahi santulan par vishwas karte hain. Hamara algorithm internet par trending topics ko curate karta hai aur hamare editorial guidelines ke anusar unhe brief, engaging format me transform karta hai jisse pathak ka samay bachta hai.</p></div></div></main>;
}
