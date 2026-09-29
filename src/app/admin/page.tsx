'use client';

import { useState } from 'react';
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

const articles = [
  { title: 'मुख्यमंत्री ने कहा कि भ्रम फैलाने की कोशिश...', category: 'India', status: 'Published', time: '12 min ago', views: '12.4k' },
  { title: 'Sensex 1000 points ऊपर, Nifty ने छुआ नया रिकॉर्ड', category: 'Business', status: 'Published', time: '28 min ago', views: '8.9k' },
  { title: 'AI और टेक्नोलॉजी से बदल रही है दुनिया', category: 'Tech', status: 'Draft', time: '1 hour ago', views: '—' },
  { title: 'Team India का नया squad जारी, युवा खिलाड़ियों को मौका', category: 'Sports', status: 'Review', time: '2 hours ago', views: '6.2k' },
];

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

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-brand"><span className="brand-mark"><Newspaper size={20} /></span><span>News<span>Portal</span></span><button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
        <div className="admin-profile"><div className="profile-avatar">P</div><div><strong>Prashant Sharma</strong><span>Administrator</span></div><span className="online-dot" /></div>
        <label className="admin-search"><Search size={16} /><input placeholder="Search menu..." /></label>
        <p className="menu-caption">Workspace</p>
        <nav className="admin-nav">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => { setActiveNav(label); setSidebarOpen(false); }}><Icon size={17} /><span>{label}</span>{label === 'Articles' && <b className="nav-count">12</b>}{label !== 'Dashboard' && label !== 'Articles' && <ChevronRight size={15} className="nav-arrow" />}</button>)}
        </nav>
        <p className="menu-caption lower">Manage</p>
        <nav className="admin-nav"><button><Users size={17} /><span>Users</span><ChevronRight size={15} className="nav-arrow" /></button><button><Settings size={17} /><span>Settings</span><ChevronRight size={15} className="nav-arrow" /></button><button><HelpCircle size={17} /><span>Help center</span></button></nav>
        <div className="admin-side-footer"><ShieldCheck size={16} /><span>System protected</span></div>
      </aside>

      {sidebarOpen && <button className="admin-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}

      <main className="admin-main">
        <header className="admin-topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button><div className="topbar-title"><span>Dashboard</span><small>Thursday, 30 September 2026</small></div><div className="topbar-actions"><button className="icon-action" aria-label="Search"><Search size={19} /></button><button className="icon-action notification" aria-label="Notifications"><Bell size={19} /><i>3</i></button><div className="top-user"><div className="profile-avatar small">P</div><span>Prashant</span><ChevronDown size={15} /></div></div></header>

        <div className="admin-content">
          <div className="welcome-row"><div><p className="eyebrow">OVERVIEW</p><h1>Good morning, Prashant <span>✦</span></h1><p className="welcome-copy">Here is what is happening with your news portal today.</p></div><div className="date-control"><CalendarDays size={16} /><span>{range}</span><ChevronDown size={15} /></div></div>

          <section className="stat-grid"><div className="stat-card accent"><div className="stat-icon"><FileText size={20} /></div><p>Total articles</p><strong>1,284</strong><span className="stat-up"><TrendingUp size={13} /> 12.8% <em>vs last month</em></span></div><div className="stat-card"><div className="stat-icon green"><Users size={20} /></div><p>Active readers</p><strong>48,920</strong><span className="stat-up"><TrendingUp size={13} /> 8.4% <em>vs last month</em></span></div><div className="stat-card"><div className="stat-icon purple"><EyeIcon /></div><p>Page views</p><strong>287.4k</strong><span className="stat-up"><TrendingUp size={13} /> 18.2% <em>vs last month</em></span></div><div className="stat-card"><div className="stat-icon orange"><Clock3 size={20} /></div><p>Pending review</p><strong>24</strong><span className="stat-warning"><Clock3 size={13} /> Needs attention</span></div></section>

          <section className="dashboard-grid top-panels"><div className="panel channel-panel"><div className="panel-heading"><div><h2>Content by category</h2><p>Published stories this month</p></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="channel-body"><div className="donut"><div><strong>1,284</strong><span>stories</span></div></div><div className="legend"><LegendItem color="#ff3d72" label="India" value="384" /><LegendItem color="#5446e8" label="World" value="226" /><LegendItem color="#ff981f" label="Business" value="198" /><LegendItem color="#24c486" label="Sports" value="176" /><LegendItem color="#8d8a9e" label="Other" value="300" /></div></div></div><div className="panel events-panel"><div className="panel-heading"><div><h2>Reader activity</h2><p>Last 7 days</p></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="chart-legend"><span><i className="dot blue" />Readers</span><span><i className="dot pink" />Shares</span><span><i className="dot orange" />Comments</span></div><MiniLineChart /></div><div className="panel device-panel"><div className="panel-heading"><div><h2>Portal health</h2><p>Live system overview</p></div><span className="health-pill">● Healthy</span></div><div className="health-list"><HealthRow label="API uptime" value="99.98%" /><HealthRow label="Database" value="Connected" /><HealthRow label="RSS feeds" value="4 active" /><HealthRow label="Last sync" value="3 min ago" /></div><div className="health-bar"><span /></div></div></section>

          <section className="dashboard-grid bottom-panels"><div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent articles</h2><p>Latest stories across your portal</p></div><button className="view-all">View all <ChevronRight size={15} /></button></div><div className="article-table"><div className="table-head"><span>Article</span><span>Category</span><span>Status</span><span>Views</span></div>{articles.map((article) => <div className="article-row" key={article.title}><div className="article-name"><span className="article-thumb"><Sparkles size={15} /></span><div><strong>{article.title}</strong><small>{article.time}</small></div></div><span className="category-label">{article.category}</span><span className={`status ${article.status.toLowerCase()}`}>{article.status}</span><span className="views">{article.views}</span></div>)}</div></div><div className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Manage your newsroom</p></div></div><button className="quick-action primary"><Sparkles size={18} /><span><strong>Generate article</strong><small>Start with AI assistance</small></span><ChevronRight size={16} /></button><button className="quick-action"><FileText size={18} /><span><strong>Review drafts</strong><small>24 articles waiting</small></span><ChevronRight size={16} /></button><button className="quick-action"><Flame size={18} /><span><strong>Trending topics</strong><small>See what readers love</small></span><ChevronRight size={16} /></button><div className="tip"><Sparkles size={16} /><span><strong>Pro tip</strong><br />Schedule your best stories for peak reader hours.</span></div></div></section>
        </div>
      </main>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) { return <div><i style={{ backgroundColor: color }} /><span>{label}</span><strong>{value}</strong></div>; }
function HealthRow({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function EyeIcon() { return <span className="eye-icon">◉</span>; }
