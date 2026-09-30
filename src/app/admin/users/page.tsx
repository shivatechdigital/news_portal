'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
type User = { id: number; name: string; email: string; role: 'admin' | 'editor' | 'author'; is_active: number | boolean; created_at: string };
const emptyForm = { name: '', email: '', password: '', role: 'author' as User['role'] };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const loadUsers = () => fetch(`${API_URL}/api/users`, { credentials: 'include', cache: 'no-store' }).then((response) => response.json()).then((payload: { users?: User[] }) => setUsers(payload.users || []));
  useEffect(() => { loadUsers(); }, []);
  const createUser = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('Creating user...');
    const response = await fetch(`${API_URL}/api/users`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error || 'Could not create user'); return; }
    setForm(emptyForm); setMessage('User created successfully. They can now use the login page.'); loadUsers();
  };
  const updateUser = async (user: User, changes: Partial<User>) => {
    const next = { ...user, ...changes };
    const response = await fetch(`${API_URL}/api/users/${user.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: next.name, role: next.role, is_active: Boolean(Number(next.is_active)) }) });
    if (response.ok) setUsers((current) => current.map((item) => item.id === user.id ? next : item));
  };
  const deleteUser = async (user: User) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    const response = await fetch(`${API_URL}/api/users/${user.id}`, { method: 'DELETE', credentials: 'include' });
    if (response.ok) setUsers((current) => current.filter((item) => item.id !== user.id));
    else setMessage((await response.json()).error || 'Could not delete user');
  };
  return <main className="edit-shell admin-child-page"><header className="edit-topbar"><div className="back-link"><Users size={17} /> User management</div><span className="save-state"><ShieldCheck size={15} /> Admin only</span></header><div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">ACCESS CONTROL</p><h1>Admin users</h1><p>Create login accounts and assign newsroom roles. Public signup is disabled.</p></div><span className="edit-status published">{users.length} users</span></div>{message && <div className="edit-message">{message}</div>}<div className="users-grid"><form className="editor-card user-create-card" onSubmit={createUser}><div className="editor-card-heading"><div><h2>Create user</h2><p>This account can sign in immediately.</p></div><UserPlus size={19} /></div><label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Temporary password<input required minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as User['role'] })}><option value="author">Author</option><option value="editor">Editor</option><option value="admin">Admin</option></select></label><button className="save-button user-submit" type="submit"><UserPlus size={15} /> Create account</button></form><section className="editor-card users-list"><div className="editor-card-heading"><div><h2>Existing users</h2><p>Change role, activate, deactivate or delete.</p></div></div>{users.map((user) => <div className="user-row" key={user.id}><div className="profile-avatar small">{user.name[0]?.toUpperCase()}</div><div className="user-identity"><strong>{user.name}</strong><small>{user.email}</small></div><select value={user.role} onChange={(event) => updateUser(user, { role: event.target.value as User['role'] })}><option value="author">Author</option><option value="editor">Editor</option><option value="admin">Admin</option></select><button className={Boolean(Number(user.is_active)) ? 'deactivate-button' : 'activate-button'} onClick={() => updateUser(user, { is_active: Boolean(Number(user.is_active)) ? 0 : 1 })}>{Boolean(Number(user.is_active)) ? 'Deactivate' : 'Activate'}</button><button className="delete-button" onClick={() => deleteUser(user)}><Trash2 size={12} /> Delete</button></div>)}</section></div></div></main>;
}
