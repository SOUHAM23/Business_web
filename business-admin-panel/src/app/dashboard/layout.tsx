'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = getSupabaseAuthClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
          router.replace('/login?returnTo=' + encodeURIComponent(pathname));
          return;
        }

        // Verify user against admin_users table
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admin_users')
          .select('role, active')
          .eq('email', user.email.toLowerCase())
          .eq('active', true)
          .single();

        if (adminErr || !adminRecord) {
          await supabase.auth.signOut();
          router.replace('/login?error=unauthorized_email&email=' + encodeURIComponent(user.email));
          return;
        }

        setCurrentUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
        });
      } catch (err) {
        console.error('Failed to fetch authenticated user session:', err);
        router.replace('/login');
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [pathname, router]);

  const navItems = [
    { label: '📊 Overview', href: '/dashboard' },
    { label: '📥 Enquiries', href: '/dashboard/enquiries' },
    { label: '📅 Appointments', href: '/dashboard/appointments' },
    { label: '👥 Customers CRM', href: '/dashboard/customers' },
    { label: '✏️ Website Content', href: '/dashboard/content' },
    { label: '📋 Recent Updates', href: '/dashboard/changelog' },
    { label: '📑 Google Sheet Sync', href: '/dashboard/google-sheets' },
    { label: '🛡️ Backup Monitor', href: '/dashboard/backups' },
    { label: '📜 Audit Logs', href: '/dashboard/audit-logs' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    const supabase = getSupabaseAuthClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const userInitial = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'A');

  if (loadingUser) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontFamily: "'Inter', sans-serif", flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(245, 158, 11, 0.2)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Verifying 12-Hour Secure Session...</span>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

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
          <div className="user-info-card">
            <div className="user-avatar-badge">
              <span className="avatar-initial">{userInitial}</span>
              <span className="online-status-dot" title="Active Session" />
            </div>
            <div className="user-details-group">
              <span className="user-display-name">
                {loadingUser ? 'Loading profile...' : (currentUser?.name || 'Admin User')}
              </span>
              <span className="user-email-text" title={currentUser?.email || ''}>
                {loadingUser ? 'Connecting...' : (currentUser?.email || 'Logged in as Admin')}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem 0.8rem', marginTop: '0.35rem' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Page Content Wrapper with Top Header */}
      <div className="main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="top-admin-header">
          <div className="top-header-left">
            <span className="system-status-pill">
              <span className="pulse-green-dot" /> Live System Active
            </span>
          </div>
          <div className="top-header-right">
            <div className="logged-in-user-badge">
              <span className="logged-in-icon">👤</span>
              <span className="logged-in-label">Logged in:</span>
              <strong className="logged-in-email">{currentUser?.email || 'Admin'}</strong>
            </div>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
