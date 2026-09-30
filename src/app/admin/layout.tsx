import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell admin-route-shell"><AdminSidebar /><div className="admin-route-content">{children}</div></div>;
}
