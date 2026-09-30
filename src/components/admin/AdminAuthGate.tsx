'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
export type AdminUser = { id: number; name: string; email: string; role: 'admin' | 'editor' | 'author' };
const AuthContext = createContext<{ user: AdminUser | null; refresh: () => Promise<void> }>({ user: null, refresh: async () => undefined });
export const useAdminAuth = () => useContext(AuthContext);

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(pathname !== '/admin/login');

  const refresh = async () => {
    const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include', cache: 'no-store' });
    if (!response.ok) { setUser(null); if (pathname !== '/admin/login') router.replace('/admin/login'); return; }
    const payload = await response.json() as { user: AdminUser };
    setUser(payload.user);
    if (pathname === '/admin/login') router.replace('/admin');
  };

  useEffect(() => { refresh().finally(() => setLoading(false)); }, [pathname]);

  if (pathname === '/admin/login') return <AuthContext.Provider value={{ user, refresh }}>{children}</AuthContext.Provider>;
  if (loading || !user) return <main className="admin-auth-loading">Checking admin session...</main>;
  return <AuthContext.Provider value={{ user, refresh }}>{children}</AuthContext.Provider>;
}
