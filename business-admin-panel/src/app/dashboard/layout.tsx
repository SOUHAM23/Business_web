'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: '📊 Overview', href: '/dashboard' },
    { label: '📥 Enquiries', href: '/dashboard/enquiries' },
    { label: '📅 Appointments', href: '/dashboard/appointments' },
    { label: '👥 Customers CRM', href: '/dashboard/customers' },
    { label: '✏️ Website Content', href: '/dashboard/content' },
    { label: '📑 Google Sheet Sync', href: '/dashboard/google-sheets' },
    { label: '🛡️ Backup Monitor', href: '/dashboard/backups' },
    { label: '📜 Audit Logs', href: '/dashboard/audit-logs' },
  ];

  const handleLogout = async () => {
    const supabase = getSupabaseAuthClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>📈 Sanchay Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="user-profile">
          <span className="user-email">Logged in as Admin</span>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
