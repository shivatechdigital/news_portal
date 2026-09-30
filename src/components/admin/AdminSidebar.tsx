'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BookOpen, ChevronRight, Grid2X2, HelpCircle, LayoutDashboard, Newspaper, Search, Settings, ShieldCheck, Users } from 'lucide-react';

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Articles', icon: Newspaper, href: '/admin/articles' },
  { label: 'Categories', icon: Grid2X2, href: '/admin/categories' },
  { label: 'Analytics', icon: Activity, href: '/admin#analytics' },
  { label: 'Sources', icon: BookOpen, href: '/admin#sources' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return <aside className="admin-sidebar shared-admin-sidebar"><div className="admin-brand"><span className="brand-mark"><Newspaper size={20} /></span><span>News<span>Portal</span></span></div><div className="admin-profile"><div className="profile-avatar">P</div><div><strong>Prashant Yadav</strong><span>Administrator</span></div><span className="online-dot" /></div><label className="admin-search"><Search size={16} /><input placeholder="Search menu..." /></label><p className="menu-caption">Workspace</p><nav className="admin-nav">{items.map(({ label, icon: Icon, href }) => <Link key={label} href={href} className={`admin-nav-link ${pathname === href || (href !== '/admin' && pathname.startsWith(href)) ? 'active' : ''}`}><Icon size={17} /><span>{label}</span>{label !== 'Dashboard' && <ChevronRight size={15} className="nav-arrow" />}</Link>)}</nav><p className="menu-caption lower">Manage</p><nav className="admin-nav"><button><Users size={17} /><span>Users</span><ChevronRight size={15} className="nav-arrow" /></button><button><Settings size={17} /><span>Settings</span><ChevronRight size={15} className="nav-arrow" /></button><button><HelpCircle size={17} /><span>Help center</span></button></nav><div className="admin-side-footer"><ShieldCheck size={16} /><span>System protected</span></div></aside>;
}
