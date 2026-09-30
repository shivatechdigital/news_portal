'use client';

import { Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AdminAuthGate';

export default function AdminProfilePage() {
  const { user } = useAdminAuth();
  return <main className="edit-shell admin-child-page"><header className="edit-topbar"><div className="back-link"><UserCircle size={17} /> My profile</div><span className="save-state"><ShieldCheck size={15} /> Authenticated</span></header><div className="edit-content"><div className="profile-page-card editor-card"><div className="large-avatar">{user?.name?.[0]?.toUpperCase()}</div><div><p className="eyebrow">NEWSROOM ACCOUNT</p><h1>{user?.name}</h1><span className="profile-role">{user?.role}</span></div><div className="profile-details"><div><Mail size={17} /><span><small>Email address</small><strong>{user?.email}</strong></span></div><div><ShieldCheck size={17} /><span><small>Access level</small><strong>{user?.role === 'admin' ? 'Full administration' : user?.role === 'editor' ? 'Content editing' : 'Content authoring'}</strong></span></div></div></div></div></main>;
}
