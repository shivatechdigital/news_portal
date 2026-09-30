'use client';

import { useEffect, useState } from 'react';
import { Check, KeyRound, RotateCcw, Save, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
const roles = ['admin', 'editor', 'author'] as const;
type Role = typeof roles[number];
type RoleMap = Record<Role, string[]>;
const groups = [
  { title: 'Dashboard', description: 'Overview and newsroom dashboard', permissions: [['dashboard.view', 'View dashboard']] },
  { title: 'Articles', description: 'Create, edit and publish news stories', permissions: [['articles.view', 'View articles'], ['articles.create', 'Create articles'], ['articles.edit', 'Edit articles'], ['articles.delete', 'Delete articles'], ['articles.publish', 'Publish or move to draft']] },
  { title: 'Categories', description: 'Manage categories and visibility', permissions: [['categories.view', 'View categories'], ['categories.manage', 'Activate, deactivate and edit'], ['categories.delete', 'Delete category and its articles']] },
  { title: 'Users & access', description: 'Control newsroom accounts and roles', permissions: [['users.view', 'View users'], ['users.create', 'Create users'], ['users.edit', 'Edit users and assign roles'], ['users.delete', 'Delete users'], ['roles.manage', 'Configure role responsibilities']] },
  { title: 'Insights & sources', description: 'Analytics and source management', permissions: [['analytics.view', 'View analytics'], ['sources.view', 'View sources']] },
  { title: 'Account & settings', description: 'Personal profile and portal settings', permissions: [['profile.edit', 'Edit own profile and password'], ['settings.manage', 'Manage portal settings']] },
] as const;

export default function RolesPage() {
  const [role, setRole] = useState<Role>('editor');
  const [saved, setSaved] = useState<RoleMap>({ admin: [], editor: [], author: [] });
  const [defaults, setDefaults] = useState<RoleMap>({ admin: [], editor: [], author: [] });
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/roles`, { credentials: 'include', cache: 'no-store' }).then((response) => response.json()).then((payload: { roles: RoleMap; defaults: RoleMap }) => {
      setSaved(payload.roles); setDefaults(payload.defaults); setSelected(payload.roles.editor || payload.defaults.editor || []);
    });
  }, []);
  const chooseRole = (nextRole: Role) => { setRole(nextRole); setSelected(saved[nextRole]?.length ? saved[nextRole] : defaults[nextRole] || []); setMessage(''); };
  const toggle = (permission: string) => setSelected((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]);
  const toggleGroup = (permissions: readonly (readonly [string, string])[]) => {
    const keys = permissions.map(([key]) => key);
    const all = keys.every((key) => selected.includes(key));
    setSelected((current) => all ? current.filter((key) => !keys.includes(key)) : [...new Set([...current, ...keys])]);
  };
  const save = async () => {
    setMessage('Saving responsibilities...');
    const response = await fetch(`${API_URL}/api/roles/${role}/permissions`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ permissions: selected }) });
    if (!response.ok) { setMessage('Could not save responsibilities.'); return; }
    setSaved((current) => ({ ...current, [role]: selected })); setMessage(`${role} responsibilities saved successfully.`);
  };
  const restoreDefaults = () => setSelected(defaults[role] || []);

  return <main className="edit-shell admin-child-page"><header className="edit-topbar"><div className="back-link"><KeyRound size={17} /> Roles & responsibilities</div><span className="save-state"><ShieldCheck size={15} /> Admin only</span></header><div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">ACCESS CONTROL</p><h1>Role responsibilities</h1><p>Choose a role, review its automatic responsibilities, then remove or add access as needed.</p></div><button className="save-button" type="button" onClick={save}><Save size={16} /> Save responsibilities</button></div>{message && <div className="edit-message">{message}</div>}<div className="role-selector">{roles.map((item) => <button key={item} className={item === role ? 'active' : ''} onClick={() => chooseRole(item)}><span>{item[0].toUpperCase()}</span><strong>{item}</strong><small>{saved[item]?.length || defaults[item]?.length || 0} responsibilities</small></button>)}</div><div className="role-toolbar"><div><strong>{role.toUpperCase()} role</strong><span>{selected.length} responsibilities selected</span></div><button type="button" onClick={restoreDefaults}><RotateCcw size={14} /> Restore defaults</button></div><div className="permission-grid">{groups.map((group) => { const all = group.permissions.every(([key]) => selected.includes(key)); return <section className="permission-card" key={group.title}><div className="permission-heading"><div><h2>{group.title}</h2><p>{group.description}</p></div><button type="button" onClick={() => toggleGroup(group.permissions)}>{all ? 'Clear group' : 'Select group'}</button></div>{group.permissions.map(([key, label]) => <label className={`permission-option ${selected.includes(key) ? 'checked' : ''}`} key={key}><input type="checkbox" checked={selected.includes(key)} onChange={() => toggle(key)} /><span className="permission-check"><Check size={13} /></span><span><strong>{label}</strong><small>{key}</small></span></label>)}</section>; })}</div></div></main>;
}
