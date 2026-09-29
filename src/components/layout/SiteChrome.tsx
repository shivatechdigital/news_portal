'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import BreakingNewsBar from './BreakingNewsBar';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return <><BreakingNewsBar /><Header /><main className="min-h-screen">{children}</main><Footer /></>;
}
