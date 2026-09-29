'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Grid2X2,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

type AdminArticle = {
  id: number;
  title: string;
  category: string;
  status: 'draft' | 'published' | string;
  views: number;
  published_at?: string;
  created_at?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Articles', icon: Newspaper },
  { label: 'Categories', icon: Grid2X2 },
  { label: 'Analytics', icon: Activity },
  { label: 'Sources', icon: BookOpen },
];

function MiniLineChart() {
  return (
    <div className="mini-chart" aria-label="Events trend chart">
      <div className="chart-grid" />
      <div className="chart-line chart-line-blue" />
      <div className="chart-line chart-line-pink" />
      <div className="chart-line chart-line-orange" />
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range] = useState('Last 7 days');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'offline'>('loading');

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      try {
        const [articlesResponse, healthResponse] = await Promise.all([
          fetch(`${API_URL}/api/articles?limit=100`, { cache: 'no-store' }),
          fetch(`${API_URL}/health`, { cache: 'no-store' }),
        ]);
        if (!articlesResponse.ok) throw new Error('Articles API unavailable');
        const payload = await articlesResponse.json() as { articles?: AdminArticle[]; total?: number };
        if (!cancelled) {
          setArticles(payload.articles || []);
          setTotalArticles(payload.total ?? payload.articles?.length ?? 0);
          setApiStatus(healthResponse.ok ? 'connected' : 'offline');
        }
      } catch {
        if (!cancelled) setApiStatus('offline');
      }
    };
    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  const publishedArticles = useMemo(() => articles.filter((article) => article.status === 'published'), [articles]);
  const pendingArticles = useMemo(() => articles.filter((article) => article.status !== 'published'), [articles]);
  const totalViews = useMemo(() => articles.reduce((total, article) => total + (Number(article.views) || 0), 0), [articles]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    publishedArticles.forEach((article) => counts.set(article.category, (counts.get(article.category) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [publishedArticles]);
  const recentArticles = useMemo(() => [...articles].sort((a, b) => new Date(b.published_at || b.created_at || 0).getTime() - new Date(a.published_at || a.created_at || 0).getTime()).slice(0, 5), [articles]);
  const formatViews = (views: number) => views > 999 ? `${(views / 1000).toFixed(1)}k` : views.toString();
  const formatTime = (date?: string) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-brand"><span className="brand-mark"><Newspaper size={20} /></span><span>News<span>Portal</span></span><button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
        <div className="admin-profile"><div className="profile-avatar">P</div><div><strong>Prashant Sharma</strong><span>Administrator</span></div><span className="online-dot" /></div>
        <label className="admin-search"><Search size={16} /><input placeholder="Search menu..." /></label>
        <p className="menu-caption">Workspace</p>
        <nav className="admin-nav">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => { setActiveNav(label); setSidebarOpen(false); }}><Icon size={17} /><span>{label}</span>{label === 'Articles' && <b className="nav-count">{totalArticles}</b>}{label !== 'Dashboard' && label !== 'Articles' && <ChevronRight size={15} className="nav-arrow" />}</button>)}
        </nav>
        <p className="menu-caption lower">Manage</p>
        <nav className="admin-nav"><button><Users size={17} /><span>Users</span><ChevronRight size={15} className="nav-arrow" /></button><button><Settings size={17} /><span>Settings</span><ChevronRight size={15} className="nav-arrow" /></button><button><HelpCircle size={17} /><span>Help center</span></button></nav>
        <div className="admin-side-footer"><ShieldCheck size={16} /><span>System protected</span></div>
      </aside>

      {sidebarOpen && <button className="admin-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}

      <main className="admin-main">
        <header className="admin-topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button><div className="topbar-title"><span>Dashboard</span><small>{today}</small></div><div className="topbar-actions"><button className="icon-action" aria-label="Search"><Search size={19} /></button><button className="icon-action notification" aria-label="Notifications"><Bell size={19} /><i>{pendingArticles.length}</i></button><div className="top-user"><div className="profile-avatar small">P</div><span>Prashant</span><ChevronDown size={15} /></div></div></header>

        <div className="admin-content">
          <div className="welcome-row"><div><p className="eyebrow">OVERVIEW</p><h1>Good morning, Prashant <span>✦</span></h1><p className="welcome-copy">Here is what is happening with your news portal today.</p></div><div className="date-control"><CalendarDays size={16} /><span>{range}</span><ChevronDown size={15} /></div></div>

          <section className="stat-grid"><div className="stat-card accent"><div className="stat-icon"><FileText size={20} /></div><p>Total articles</p><strong>{apiStatus === 'loading' ? '...' : totalArticles.toLocaleString()}</strong><span className="stat-up"><TrendingUp size={13} /> {publishedArticles.length} <em>published</em></span></div><div className="stat-card"><div className="stat-icon green"><Users size={20} /></div><p>Published articles</p><strong>{publishedArticles.length.toLocaleString()}</strong><span className="stat-up"><BookOpen size={13} /> Live on portal</span></div><div className="stat-card"><div className="stat-icon purple"><EyeIcon /></div><p>Page views</p><strong>{formatViews(totalViews)}</strong><span className="stat-up"><TrendingUp size={13} /> From articles</span></div><div className="stat-card"><div className="stat-icon orange"><Clock3 size={20} /></div><p>Pending review</p><strong>{pendingArticles.length}</strong><span className="stat-warning"><Clock3 size={13} /> Needs attention</span></div></section>

          <section className="dashboard-grid top-panels"><div className="panel channel-panel"><div className="panel-heading"><div><h2>Content by category</h2><p>Published stories from API</p></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="channel-body"><div className="donut"><div><strong>{publishedArticles.length}</strong><span>stories</span></div></div><div className="legend">{categoryCounts.length ? categoryCounts.map(([category, count], index) => <LegendItem key={category} color={['#ff3d72', '#5446e8', '#ff981f', '#24c486', '#8d8a9e'][index]} label={category} value={count.toString()} />) : <span className="empty-state">No published articles yet</span>}</div></div></div><div className="panel events-panel"><div className="panel-heading"><div><h2>Reader activity</h2><p>Connect analytics for reader trends</p></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="chart-legend"><span><i className="dot blue" />Articles</span><span><i className="dot pink" />Views</span><span><i className="dot orange" />Pending</span></div><MiniLineChart /></div><div className="panel device-panel"><div className="panel-heading"><div><h2>Portal health</h2><p>Live API overview</p></div><span className={`health-pill ${apiStatus === 'connected' ? '' : 'offline'}`}>● {apiStatus === 'connected' ? 'Connected' : apiStatus === 'loading' ? 'Checking' : 'Offline'}</span></div><div className="health-list"><HealthRow label="API status" value={apiStatus === 'connected' ? 'Connected' : 'Unavailable'} /><HealthRow label="Database" value={apiStatus === 'connected' ? 'Connected' : 'Unknown'} /><HealthRow label="Published" value={publishedArticles.length.toString()} /><HealthRow label="Last sync" value={apiStatus === 'connected' ? 'Just now' : '—'} /></div><div className="health-bar"><span style={{ width: apiStatus === 'connected' ? '100%' : '20%' }} /></div></div></section>

          <section className="dashboard-grid bottom-panels"><div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent articles</h2><p>Latest stories from your database</p></div><button className="view-all">{articles.length} loaded <ChevronRight size={15} /></button></div><div className="article-table"><div className="table-head"><span>Article</span><span>Category</span><span>Status</span><span>Views</span></div>{recentArticles.length ? recentArticles.map((article) => <div className="article-row" key={article.id}><div className="article-name"><span className="article-thumb"><Sparkles size={15} /></span><div><strong>{article.title}</strong><small>{formatTime(article.published_at || article.created_at)}</small></div></div><span className="category-label">{article.category}</span><span className={`status ${article.status.toLowerCase()}`}>{article.status}</span><span className="views">{formatViews(Number(article.views) || 0)}</span></div>) : <div className="empty-state">{apiStatus === 'loading' ? 'Loading articles...' : 'No articles found.'}</div>}</div></div><div className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Manage your newsroom</p></div></div><button className="quick-action primary"><Sparkles size={18} /><span><strong>Generate article</strong><small>Start with AI assistance</small></span><ChevronRight size={16} /></button><button className="quick-action"><FileText size={18} /><span><strong>Review drafts</strong><small>{pendingArticles.length} articles waiting</small></span><ChevronRight size={16} /></button><button className="quick-action"><Flame size={18} /><span><strong>Published stories</strong><small>{publishedArticles.length} live on portal</small></span><ChevronRight size={16} /></button><div className="tip"><Sparkles size={16} /><span><strong>Live data</strong><br />Dashboard values are loaded from your news API.</span></div></div></section>
        </div>
      </main>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) { return <div><i style={{ backgroundColor: color }} /><span>{label}</span><strong>{value}</strong></div>; }
function HealthRow({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function EyeIcon() { return <span className="eye-icon">◉</span>; }
