import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthGate from '@/components/admin/AdminAuthGate';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGate><div className="admin-shell admin-route-shell"><AdminSidebar /><div className="admin-route-content">{children}</div></div></AdminAuthGate>;
}
