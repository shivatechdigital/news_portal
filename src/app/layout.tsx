import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import SiteChrome from '@/components/layout/SiteChrome';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const hindi = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'], 
  variable: '--font-hindi' 
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'),
  title: {
    default: 'NewsPortal - Latest Hindi News',
    template: '%s | NewsPortal',
  },
  description: 'India ki sabse tez aur reliable news. Politics, Sports, Tech, Business - sab kuch ek jagah.',
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    siteName: 'NewsPortal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${inter.variable} ${hindi.variable}`}>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
