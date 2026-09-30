'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail, Newspaper } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    const response = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!response.ok) { const payload = await response.json(); setError(payload.error || 'Login failed'); setLoading(false); return; }
    router.replace('/admin'); router.refresh();
  };

  return <main className="admin-login-page"><section className="admin-login-card"><div className="login-brand"><span><Newspaper size={24} /></span><div><strong>NewsPortal</strong><small>Secure newsroom administration</small></div></div><div className="login-heading"><p className="eyebrow">ADMIN ACCESS</p><h1>Welcome back</h1><p>Sign in using an account created by your administrator.</p></div>{error && <div className="login-error">{error}</div>}<form onSubmit={login}><label>Email address<div><Mail size={16} /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" /></div></label><label>Password<div><LockKeyhole size={16} /><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" /></div></label><button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button></form><p className="no-signup">Accounts can only be created by an administrator. Public signup is disabled.</p></section></main>;
}
