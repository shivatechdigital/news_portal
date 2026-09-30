'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit3, Grid2X2, Plus, Power, Search, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
type CategoryRow = { name: string; posts: number; is_active: number | boolean };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/categories`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { categories?: CategoryRow[] }) => setCategories(payload.categories || []))
      .catch(() => setMessage('Could not load categories.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => categories.filter((category) => category.name.includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)), [categories, query]);
  const allSelected = filtered.length > 0 && filtered.every((category) => selected.includes(category.name));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((category) => category.name));
  const toggleOne = (name: string) => setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const setCategoryActive = async (name: string, active: boolean) => {
    setMessage('Saving category status...');
    const response = await fetch(`${API_URL}/api/categories/${encodeURIComponent(name)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: active }),
    });
    if (!response.ok) { setMessage('Could not update category status.'); return; }
    setCategories((current) => current.map((category) => category.name === name ? { ...category, is_active: active } : category));
    setMessage(`${name} category ${active ? 'activated' : 'deactivated'}.`);
  };
  const setSelectedActive = async (active: boolean) => {
    await Promise.all(selected.map((name) => setCategoryActive(name, active)));
    setSelected([]);
  };
  const editCategory = (row: CategoryRow) => {
    const next = window.prompt('Category name', row.name)?.trim().toLowerCase();
    if (!next || next === row.name) return;
    setCategories((current) => current.map((category) => category.name === row.name ? { ...category, name: next } : category));
    setMessage('Category rename is shown locally. Database enum migration is required to persist a rename.');
  };
  const deleteCategory = async (category: CategoryRow) => {
    const confirmed = window.confirm(`Delete ${category.name} and all ${category.posts} articles in it? This cannot be undone.`);
    if (!confirmed) return;
    setMessage(`Deleting ${category.name} and its articles...`);
    const response = await fetch(`${API_URL}/api/categories/${encodeURIComponent(category.name)}`, { method: 'DELETE' });
    if (!response.ok) { setMessage('Could not delete category.'); return; }
    const payload = await response.json() as { deleted_articles?: number };
    setCategories((current) => current.filter((item) => item.name !== category.name));
    setSelected((current) => current.filter((name) => name !== category.name));
    setMessage(`${category.name} deleted with ${payload.deleted_articles ?? category.posts} articles.`);
  };

  return <main className="edit-shell admin-child-page"><header className="edit-topbar"><div className="back-link"><Grid2X2 size={17} /> Category management</div><button className="save-button" type="button" onClick={() => window.alert('Add the category to siteConfig and database enum before publishing articles.')}><Plus size={16} /> Add category</button></header><div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">CONTENT TAXONOMY</p><h1>Categories</h1><p>Review categories, post counts and publishing availability.</p></div><span className="edit-status published">{filtered.length} categories</span></div>{message && <div className="edit-message">{message}</div>}<div className="editor-card admin-list-card"><div className="admin-list-toolbar"><div><strong>All categories</strong><small className="table-range">{categories.reduce((total, category) => total + Number(category.posts), 0)} posts assigned</small></div><label className="admin-list-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value.toLowerCase())} placeholder="Search category..." /></label></div>{selected.length > 0 && <div className="bulk-toolbar"><strong>{selected.length} selected</strong><button type="button" onClick={() => setSelectedActive(true)}>Activate selected</button><button type="button" onClick={() => setSelectedActive(false)}>Deactivate selected</button><button type="button" onClick={() => setSelected([])}>Clear</button></div>}<div className="category-table"><div className="category-table-head"><label className="select-all"><input type="checkbox" checked={allSelected} onChange={toggleAll} /> Select all</label><span>Category name</span><span>Number of posts</span><span>Status</span><span>Action</span></div>{loading ? <p className="empty-state">Loading categories...</p> : filtered.map((category) => { const active = Boolean(Number(category.is_active)); return <div className="category-table-row" key={category.name}><input className="row-check" type="checkbox" checked={selected.includes(category.name)} onChange={() => toggleOne(category.name)} aria-label={`Select ${category.name}`} /><strong className="category-name">{category.name}</strong><span className="post-count">{category.posts}</span><span className={`category-state ${active ? 'active' : 'inactive'}`}>{active ? 'Active' : 'Inactive'}</span><span className="row-actions"><button className="edit-button" type="button" onClick={() => editCategory(category)}><Edit3 size={11} /> Edit</button><button className={active ? 'deactivate-button' : 'activate-button'} type="button" onClick={() => setCategoryActive(category.name, !active)}><Power size={11} /> {active ? 'Deactivate' : 'Activate'}</button><button className="delete-button" type="button" onClick={() => deleteCategory(category)}><Trash2 size={11} /> Delete</button></span></div>; })}</div></div></div></main>;
}
