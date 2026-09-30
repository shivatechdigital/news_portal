'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, BookOpen, ChevronRight, Grid2X2, HelpCircle, LayoutDashboard, LogOut, Newspaper, Search, Settings, ShieldCheck, UserCircle, Users } from 'lucide-react';
import { useAdminAuth } from './AdminAuthGate';

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Articles', icon: Newspaper, href: '/admin/articles' },
  { label: 'Categories', icon: Grid2X2, href: '/admin/categories' },
  { label: 'Analytics', icon: Activity, href: '/admin#analytics' },
  { label: 'Sources', icon: BookOpen, href: '/admin#sources' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminAuth();
  if (pathname === '/admin/login') return null;
  const signOut = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com'}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    router.replace('/admin/login'); router.refresh();
  };
  return <aside className="admin-sidebar shared-admin-sidebar"><div className="admin-brand"><span className="brand-mark"><Newspaper size={20} /></span><span>News<span>Portal</span></span></div><Link href="/admin/profile" className="admin-profile"><div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</div><div><strong>{user?.name || 'Administrator'}</strong><span>{user?.role || 'admin'}</span></div><span className="online-dot" /></Link><label className="admin-search"><Search size={16} /><input placeholder="Search menu..." /></label><p className="menu-caption">Workspace</p><nav className="admin-nav">{items.map(({ label, icon: Icon, href }) => <Link key={label} href={href} className={`admin-nav-link ${pathname === href || (href !== '/admin' && pathname.startsWith(href)) ? 'active' : ''}`}><Icon size={17} /><span>{label}</span>{label !== 'Dashboard' && <ChevronRight size={15} className="nav-arrow" />}</Link>)}</nav><p className="menu-caption lower">Manage</p><nav className="admin-nav">{user?.role === 'admin' && <Link href="/admin/users" className={`admin-nav-link ${pathname.startsWith('/admin/users') ? 'active' : ''}`}><Users size={17} /><span>Users</span><ChevronRight size={15} className="nav-arrow" /></Link>}<Link href="/admin/profile" className={`admin-nav-link ${pathname === '/admin/profile' ? 'active' : ''}`}><UserCircle size={17} /><span>Profile</span><ChevronRight size={15} className="nav-arrow" /></Link><button><Settings size={17} /><span>Settings</span><ChevronRight size={15} className="nav-arrow" /></button><button><HelpCircle size={17} /><span>Help center</span></button><button onClick={signOut}><LogOut size={17} /><span>Sign out</span></button></nav><div className="admin-side-footer"><ShieldCheck size={16} /><span>System protected</span></div></aside>;
}
