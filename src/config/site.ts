export const siteConfig = {
  name: 'NewsPortal',
  description: 'India ki sabse tez aur reliable news website',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/images/og-default.jpg',
  locale: 'hi_IN',
  categories: [
    { name: 'India', slug: 'india', color: 'bg-orange-500' },
    { name: 'World', slug: 'world', color: 'bg-blue-500' },
    { name: 'Business', slug: 'business', color: 'bg-green-500' },
    { name: 'Sports', slug: 'sports', color: 'bg-red-500' },
    { name: 'Tech', slug: 'tech', color: 'bg-purple-500' },
    { name: 'Entertainment', slug: 'entertainment', color: 'bg-pink-500' },
    { name: 'Local', slug: 'local', color: 'bg-yellow-500' },
  ],
  social: {
    twitter: '@yourhandle',
    facebook: 'yourpage',
    youtube: 'yourchannel',
  },
};
