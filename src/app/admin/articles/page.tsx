'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Edit3, Moon, Plus, Search, Sun, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
const pageSizes = [20, 50, 100, 200];
const categories = ['all', 'india', 'world', 'business', 'sports', 'tech', 'entertainment', 'local'];
const statuses = ['all', 'published', 'draft'];
type SortKey = 'id' | 'title' | 'category' | 'status' | 'views';
type Article = { id: number; title: string; slug: string; summary?: string; category: string; status: string; views: number; created_at?: string; published_at?: string };

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const dark = window.localStorage.getItem('newsportal-theme') === 'dark';
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
    fetch(`${API_URL}/api/articles?limit=1000&admin=true`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { articles?: Article[] }) => setArticles(payload.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => setIsDarkMode((current) => {
    const next = !current;
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('newsportal-theme', next ? 'dark' : 'light');
    return next;
  });
  const changeSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDirection('asc'); }
    setCurrentPage(1);
  };
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = articles.filter((article) => (!search || `${article.title} ${article.category} ${article.status}`.toLowerCase().includes(search)) && (categoryFilter === 'all' || article.category === categoryFilter) && (statusFilter === 'all' || article.status === statusFilter));
    return [...result].sort((left, right) => {
      const a = sortKey === 'id' || sortKey === 'views' ? Number(left[sortKey]) : String(left[sortKey]).toLowerCase();
      const b = sortKey === 'id' || sortKey === 'views' ? Number(right[sortKey]) : String(right[sortKey]).toLowerCase();
      const comparison = a < b ? -1 : a > b ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [articles, categoryFilter, query, sortDirection, sortKey, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleArticles = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleIds = visibleArticles.map((article) => article.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const toggleSelected = (id: number) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSelectAll = () => setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]);
  const changeSelectedStatus = (status: string) => { setArticles((current) => current.map((article) => selectedIds.includes(article.id) ? { ...article, status } : article)); setSelectedIds([]); };
  const sortIndicator = (key: SortKey) => sortKey === key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕';
  const pageStart = filtered.length ? (currentPage - 1) * pageSize + 1 : 0;
  const pageEnd = Math.min(currentPage * pageSize, filtered.length);
  const formatViews = (views: number) => views > 999 ? `${(views / 1000).toFixed(1)}k` : views.toString();
  const formatTime = (date?: string) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  return <main className="edit-shell"><header className="edit-topbar"><Link href="/admin" className="back-link"><ArrowLeft size={17} /> Back to dashboard</Link><div className="edit-top-actions"><button className="preview-button" type="button" onClick={toggleTheme}>{isDarkMode ? <Sun size={16} /> : <Moon size={16} />} {isDarkMode ? 'Light' : 'Dark'}</button><Link href="/admin/articles/new" className="save-button"><Plus size={16} /> Add new</Link></div></header><div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">ARTICLE MANAGEMENT</p><h1>Update News</h1><p>Manage, edit and publish stories from your database.</p></div><span className="edit-status published">{filtered.length} entries</span></div><div className="editor-card admin-list-card"><div className="admin-list-toolbar"><div><strong>All articles</strong><small className="table-range">Showing {pageStart}-{pageEnd} of {filtered.length}</small></div><div className="table-tools"><label className="page-size"><span>Show</span><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}>{pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}</select></label><label className="page-size"><span>Category</span><select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setCurrentPage(1); }}>{categories.map((category) => <option key={category} value={category}>{category === 'all' ? 'All' : category}</option>)}</select></label><label className="page-size"><span>Status</span><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}>{statuses.map((status) => <option key={status} value={status}>{status === 'all' ? 'All' : status}</option>)}</select></label><label className="admin-list-search"><Search size={15} /><input placeholder="Search articles..." value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} /></label></div></div>{selectedIds.length > 0 && <div className="bulk-toolbar"><strong>{selectedIds.length} selected</strong><select defaultValue="" onChange={(event) => { if (event.target.value) changeSelectedStatus(event.target.value); }}><option value="">Change status...</option><option value="published">Publish selected</option><option value="draft">Move to draft</option></select><button type="button" onClick={() => setSelectedIds([])}>Clear selection</button></div>}<div className="admin-full-table"><div className="full-table-head"><label className="select-all"><input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} /></label><button onClick={() => changeSort('id')}>ID {sortIndicator('id')}</button><button onClick={() => changeSort('title')}>Title / details {sortIndicator('title')}</button><button onClick={() => changeSort('category')}>Category {sortIndicator('category')}</button><button onClick={() => changeSort('status')}>Status {sortIndicator('status')}</button><button onClick={() => changeSort('views')}>Views {sortIndicator('views')}</button><span>Action</span></div>{loading ? <p className="empty-state">Loading articles...</p> : visibleArticles.length ? visibleArticles.map((article) => <div className="full-table-row" key={article.id}><input className="row-check" type="checkbox" checked={selectedIds.includes(article.id)} onChange={() => toggleSelected(article.id)} aria-label={`Select article ${article.id}`} /><span className="article-id">{article.id}</span><Link href={`/admin/articles/${article.id}/edit`} className="full-article-title"><strong>{article.title}</strong><small>{article.summary || 'No summary available'} · {formatTime(article.published_at || article.created_at)}</small></Link><span className="category-label">{article.category}</span><span className={`status ${article.status.toLowerCase()}`}>{article.status}</span><span className="views">{formatViews(Number(article.views) || 0)}</span><span className="row-actions"><Link href={`/admin/articles/${article.id}/edit`} className="edit-button"><Edit3 size={11} /> Edit</Link><button className="delete-button" type="button" onClick={() => setArticles((current) => current.filter((item) => item.id !== article.id))}><Trash2 size={11} /> Delete</button></span></div>) : <p className="empty-state">No articles found.</p>}</div><div className="pagination-bar"><span>Page {currentPage} of {totalPages}</span><div><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}><ChevronLeft size={16} /> Previous</button>{Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((page) => <button className={page === currentPage ? 'active-page' : ''} key={page} type="button" onClick={() => setCurrentPage(page)}>{page}</button>)}<button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>Next <ChevronRight size={16} /></button></div></div></div></div></main>;
}
