'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Eye, Image as ImageIcon, Save, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
const categories = ['india', 'world', 'business', 'sports', 'tech', 'entertainment', 'local'];

type EditArticle = {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  summary: string;
  meta_description: string;
  content: string;
  source_name: string;
  source_url: string;
  image_url: string;
};

type EditPageProps = { params: Promise<{ id: string }> };

export default function ArticleEditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [article, setArticle] = useState<EditArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadArticle = async () => {
      const { id } = await params;
      try {
        const response = await fetch(`${API_URL}/api/articles?limit=100&admin=true`, { cache: 'no-store' });
        const payload = await response.json() as { articles?: EditArticle[] };
        const found = payload.articles?.find((item) => item.id === Number(id));
        if (!cancelled) setArticle(found || null);
      } catch {
        if (!cancelled) setArticle(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadArticle();
    return () => { cancelled = true; };
  }, [params]);

  const updateField = (field: keyof EditArticle, value: string) => {
    setArticle((current) => current ? { ...current, [field]: value } : current);
  };

  const handleSave = async () => {
    if (!article) return;
    setMessage('Saving...');
    const response = await fetch(`${API_URL}/api/articles/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    setMessage(response.ok ? 'Changes saved successfully.' : 'Could not save changes.');
  };

  const handleDelete = async () => {
    if (!article || !window.confirm('Delete this article permanently?')) return;
    const response = await fetch(`${API_URL}/api/articles/${article.id}`, { method: 'DELETE' });
    if (response.ok) router.push('/admin');
    else setMessage('Could not delete article.');
  };

  if (isLoading) return <main className="edit-shell"><div className="edit-loading">Loading article editor...</div></main>;
  if (!article) return <main className="edit-shell"><div className="edit-empty"><h1>Article not found</h1><Link href="/admin">Back to dashboard</Link></div></main>;

  return (
    <main className="edit-shell">
      <header className="edit-topbar"><Link href="/admin" className="back-link"><ArrowLeft size={17} /> Back to dashboard</Link><div className="edit-top-actions"><span className="save-state"><ShieldCheck size={15} /> Admin editor</span><button className="preview-button" type="button" onClick={() => window.open(`/news/${article.slug}`, '_blank')}><Eye size={16} /> Preview</button><button className="save-button" type="button" onClick={handleSave}><Save size={16} /> Save changes</button></div></header>
      <div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">ARTICLE MANAGEMENT / EDIT</p><h1>Edit article</h1><p>Refine the story details before it goes live on NewsPortal.</p></div><span className={`edit-status ${article.status.toLowerCase()}`}>{article.status}</span></div>{message && <div className="edit-message">{message}</div>}
        <div className="editor-grid"><section className="editor-main"><div className="editor-card"><div className="editor-card-heading"><div><h2>Story details</h2><p>Headline and reader-facing content</p></div><Sparkles size={19} /></div><label>Headline<input value={article.title} onChange={(event) => updateField('title', event.target.value)} /></label><label>URL slug<input value={article.slug} onChange={(event) => updateField('slug', event.target.value)} /></label><label>Summary<textarea rows={3} value={article.summary} onChange={(event) => updateField('summary', event.target.value)} /></label><label>Article content<textarea className="content-editor" rows={16} value={article.content.replace(/<\/?p>/g, '').replace(/<\/?h2>/g, '')} onChange={(event) => updateField('content', `<p>${event.target.value}</p>`)} /></label></div><div className="editor-card"><div className="editor-card-heading"><div><h2>SEO metadata</h2><p>Improve how this article appears in search</p></div></div><label>Meta description<textarea rows={3} value={article.meta_description} onChange={(event) => updateField('meta_description', event.target.value)} /></label></div></section><aside className="editor-side"><div className="editor-card"><div className="editor-card-heading"><div><h2>Publishing</h2><p>Visibility and classification</p></div></div><label>Status<select value={article.status} onChange={(event) => updateField('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label><label>Category<select value={article.category} onChange={(event) => updateField('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Source name<input value={article.source_name} onChange={(event) => updateField('source_name', event.target.value)} /></label><label>Source URL<input value={article.source_url} onChange={(event) => updateField('source_url', event.target.value)} /></label></div><div className="editor-card"><div className="editor-card-heading"><div><h2>Cover image</h2><p>RSS or generated image URL</p></div><ImageIcon size={18} /></div><input value={article.image_url} onChange={(event) => updateField('image_url', event.target.value)} placeholder="https://..." />{article.image_url && <Image className="cover-preview" src={article.image_url} alt="Article cover preview" width={640} height={360} unoptimized />}<button className="danger-button" type="button" onClick={handleDelete}><Trash2 size={15} /> Delete article</button></div></aside></div>
      </div>
    </main>
  );
}

