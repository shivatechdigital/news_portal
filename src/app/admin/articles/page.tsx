'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit3, Plus, Search, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';

type Article = { id: number; title: string; slug: string; summary?: string; category: string; status: string; views: number; };

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/articles?limit=100&admin=true`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { articles?: Article[] }) => setArticles(payload.articles || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter((article) => `${article.title} ${article.category}`.toLowerCase().includes(query.toLowerCase()));

  return <main className="edit-shell"><header className="edit-topbar"><Link href="/admin" className="back-link"><ArrowLeft size={17} /> Back to dashboard</Link><Link href="/admin/articles/new" className="save-button"><Plus size={16} /> Add new</Link></header><div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">ARTICLE MANAGEMENT</p><h1>Update News</h1><p>Manage, edit and publish stories from your database.</p></div><span className="edit-status published">{articles.length} entries</span></div><div className="editor-card admin-list-card"><div className="admin-list-toolbar"><strong>All articles</strong><label className="admin-list-search"><Search size={15} /><input placeholder="Search articles..." value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><div className="admin-full-table"><div className="full-table-head"><span>Select</span><span>ID</span><span>Title / details</span><span>Category</span><span>Status</span><span>Live</span><span>Action</span></div>{loading ? <p className="empty-state">Loading articles...</p> : filtered.length ? filtered.map((article) => <div className="full-table-row" key={article.id}><input className="row-check" type="checkbox" aria-label={`Select article ${article.id}`} /><span className="article-id">{article.id}</span><Link href={`/admin/articles/${article.id}/edit`} className="full-article-title"><strong>{article.title}</strong><small>{article.summary || 'No summary available'}</small></Link><span className="category-label">{article.category}</span><span className={`status ${article.status.toLowerCase()}`}>{article.status}</span><span className="live-state">Yes</span><span className="row-actions"><Link href={`/admin/articles/${article.id}/edit`} className="edit-button"><Edit3 size={11} /> Edit</Link><button className="delete-button" type="button" onClick={() => setArticles((current) => current.filter((item) => item.id !== article.id))}><Trash2 size={11} /> Delete</button></span></div>) : <p className="empty-state">No articles found.</p>}</div></div></div></main>;
}
