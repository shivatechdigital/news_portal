'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Mail, Save, ShieldCheck, UserCircle } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AdminAuthGate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';

export default function AdminProfilePage() {
  const { user, refresh } = useAdminAuth();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) setName(user.name); }, [user]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    if (newPassword && newPassword !== confirmPassword) { setMessage('New passwords do not match.'); return; }
    if (newPassword && !currentPassword) { setMessage('Enter your current password to set a new password.'); return; }
    setSaving(true);
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, current_password: currentPassword, new_password: newPassword }),
    });
    const payload = await response.json();
    if (!response.ok) setMessage(payload.error || 'Could not update profile.');
    else {
      setMessage('Profile updated successfully.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); await refresh();
    }
    setSaving(false);
  };

  return <main className="edit-shell admin-child-page"><header className="edit-topbar"><div className="back-link"><UserCircle size={17} /> My profile</div><span className="save-state"><ShieldCheck size={15} /> Authenticated</span></header><div className="edit-content"><div className="edit-heading"><div><p className="eyebrow">NEWSROOM ACCOUNT</p><h1>Edit profile</h1><p>Update your display name and secure your account password.</p></div><span className="edit-status published">{user?.role}</span></div>{message && <div className="edit-message">{message}</div>}<div className="profile-edit-grid"><aside className="editor-card profile-summary"><div className="large-avatar">{name?.[0]?.toUpperCase() || 'A'}</div><h2>{name || user?.name}</h2><span className="profile-role">{user?.role}</span><div className="profile-details single"><div><Mail size={17} /><span><small>Email address</small><strong>{user?.email}</strong></span></div><div><ShieldCheck size={17} /><span><small>Access level</small><strong>{user?.role === 'admin' ? 'Full administration' : user?.role === 'editor' ? 'Content editing' : 'Content authoring'}</strong></span></div></div></aside><form className="editor-card profile-edit-form" onSubmit={saveProfile}><div className="editor-card-heading"><div><h2>Personal details</h2><p>Email and role can only be changed by another administrator.</p></div><UserCircle size={19} /></div><label>Display name<input required value={name} onChange={(event) => setName(event.target.value)} /></label><div className="password-section"><div className="editor-card-heading"><div><h2>Change password</h2><p>Leave these fields empty to keep your current password.</p></div><KeyRound size={19} /></div><label>Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /></label><label>New password<input type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /></label><label>Confirm new password<input type="password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></label></div><button className="save-button profile-save" type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save profile'}</button></form></div></div></main>;
}
