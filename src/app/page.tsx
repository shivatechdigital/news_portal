import api from '@/lib/api';
import { Article } from '@/types/article';
import HeroSection from '@/components/news/HeroSection';
import CategorySection from '@/components/news/CategorySection';
import TrendingNews from '@/components/news/TrendingNews';
import NewsCardCompact from '@/components/news/NewsCardCompact';
import AdBanner from '@/components/shared/AdBanner';
import Newsletter from '@/components/shared/Newsletter';

export const revalidate = 60;

const fallbackArticles: Article[] = [
  { id: 1, title: 'Lok Sabha Chunav 2025: Naye Niyam aur Karyakram ki Ghoshna', slug: 'lok-sabha-chunav-2025-naye-niyam', meta_description: 'Chunav Aayog ne aane wale lok sabha chunav ke liye naye guidelines jari kar diye hain.', summary: 'Chunav Aayog ne aane wale lok sabha chunav ke liye naye guidelines jari kar diye hain jisme digital voting aur EVM security shamil hai.', content: '<p>Full content text...</p>', source_name: 'Times of India', source_url: 'https://timesofindia.indiatimes.com', category: 'india', image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80', status: 'published', views: 1240, published_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 2, title: 'Sensex All-Time High: IT aur Banking stocks me bhari tezi', slug: 'sensex-all-time-high-it-banking-rally', meta_description: 'Share bazaar me aaj naya itihas racha gaya, Nifty 24500 ke paar pahunch gaya.', summary: 'Share bazaar me aaj naya itihas racha gaya, Nifty aur Sensex dono record unchai par band hue.', content: '<p>Full content text...</p>', source_name: 'Economic Times', source_url: 'https://economictimes.indiatimes.com', category: 'business', image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80', status: 'published', views: 890, published_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date().toISOString() },
  { id: 3, title: 'Champions Trophy 2025: Team India ka naya squad jari', slug: 'champions-trophy-team-india-squad', meta_description: 'BCCI ne aane wale tournament ke liye 15-sadasiya team ki ghoshna kar di hai.', summary: 'BCCI ne aane wale tournament ke liye team ki ghoshna kar di hai, kuch naye yuva khiladiyo ko mauka mila hai.', content: '<p>Full content text...</p>', source_name: 'Hindustan Times', source_url: 'https://hindustantimes.com', category: 'sports', image_url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=800&auto=format&fit=crop&q=80', status: 'published', views: 3100, published_at: new Date(Date.now() - 7200000).toISOString(), created_at: new Date().toISOString() },
  { id: 4, title: 'AI Revolution: Naya LLM Model Hindi bhasha me launch hua', slug: 'ai-revolution-hindi-llm-model-launch', meta_description: 'Indian tech startups ne milkar banaya Bharat ka apna AI engine.', summary: 'Indian tech startups ne milkar banaya Bharat ka apna AI engine jo 22 bhashao me kaam karta hai.', content: '<p>Full content text...</p>', source_name: 'TechCrunch', source_url: 'https://techcrunch.com', category: 'tech', image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80', status: 'published', views: 650, published_at: new Date(Date.now() - 10800000).toISOString(), created_at: new Date().toISOString() },
  { id: 5, title: 'Box Office Update: Nayi Film ne pehle din kamaye 50 Crore', slug: 'box-office-nayi-film-record-collection', meta_description: 'Cinema gharo me dhoom, pehle hi din sare record tode.', summary: 'Cinema gharo me dhoom machi hui hai aur film ne worldwide bumper opening li hai.', content: '<p>Full content text...</p>', source_name: 'NDTV', source_url: 'https://ndtv.com', category: 'entertainment', image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80', status: 'published', views: 1450, published_at: new Date(Date.now() - 14400000).toISOString(), created_at: new Date().toISOString() },
];

async function getArticlesData() {
  try {
    const res = await api.get('/api/articles?limit=30');
    if (res.data?.articles && res.data.articles.length > 0) return res.data.articles as Article[];
    return fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export default async function HomePage() {
  const allArticles = await getArticlesData();
  const heroArticles = allArticles.slice(0, 5);
  const trendingArticles = [...allArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentArticles = allArticles.slice(5, 9);
  const indiaArticles = allArticles.filter((a) => a.category.toLowerCase() === 'india');
  const techArticles = allArticles.filter((a) => a.category.toLowerCase() === 'tech');
  const sportsArticles = allArticles.filter((a) => a.category.toLowerCase() === 'sports');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <HeroSection articles={heroArticles} />
      <AdBanner format="horizontal" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8">
          <CategorySection title="🇮🇳 India News" slug="india" articles={indiaArticles.length > 0 ? indiaArticles : allArticles.slice(0, 3)} />
          <AdBanner format="horizontal" className="my-8" />
          <CategorySection title="💻 Tech & Auto" slug="tech" articles={techArticles.length > 0 ? techArticles : allArticles.slice(1, 4)} />
          <CategorySection title="🏏 Sports News" slug="sports" articles={sportsArticles.length > 0 ? sportsArticles : allArticles.slice(2, 5)} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <TrendingNews articles={trendingArticles} />
          <Newsletter />
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"><h3 className="font-bold text-gray-900 dark:text-white text-base mb-3 pb-3 border-b border-gray-100 dark:border-gray-800 uppercase tracking-wider">⚡ Taaza Khabar</h3><div className="divide-y divide-gray-100 dark:divide-gray-800">{recentArticles.map((article) => <NewsCardCompact key={article.id} article={article} />)}</div></div>
          <AdBanner format="rectangle" />
        </div>
      </div>
    </div>
  );
}
