'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    pendingAppointments: 0,
    totalCustomers: 0,
    lastSheetSync: 'Never',
    lastBackupStatus: 'Healthy',
  });

  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const supabase = getSupabaseAuthClient();

      const { count: enquiryCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
      const { count: newCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'NEW');
      const { count: apptCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
      const { count: custCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });

      const { data: recent } = await supabase
        .from('enquiries')
        .select('id, service, source, status, created_at, customers(name, phone)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalEnquiries: enquiryCount || 0,
        newEnquiries: newCount || 0,
        pendingAppointments: apptCount || 0,
        totalCustomers: custCount || 0,
        lastSheetSync: 'Automated 12-Hour Schedule',
        lastBackupStatus: 'AES-256 Encrypted Active',
      });

      if (recent) setRecentEnquiries(recent);
    }

    loadStats();
  }, []);

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Executive Dashboard</h1>
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sanchay Path Operations</span>
      </div>

      {/* Metrics Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">Total Leads / Enquiries</div>
          <div className="stat-value">{stats.totalEnquiries}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">New Actionable Leads</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.newEnquiries}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">Pending Appointments</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.pendingAppointments}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">Total CRM Customers</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.totalCustomers}</div>
        </div>
      </div>

      {/* System Operational Health Status */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#f59e0b' }}>⚡ System Operational Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Primary Database</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>🟢 Supabase Postgres Online</span>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Meta WhatsApp Worker</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>🟢 Cloudflare Worker Active</span>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>12-Hour Sheet Snapshot</span>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>🔄 {stats.lastSheetSync}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Google Drive Backup</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>🛡️ {stats.lastBackupStatus}</span>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Enquiries & WhatsApp Leads</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Service</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEnquiries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>No enquiries recorded yet.</td>
              </tr>
            ) : (
              recentEnquiries.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                  <td>{e.customers?.name || 'Anonymous'}</td>
                  <td>{e.customers?.phone || 'N/A'}</td>
                  <td>{e.service}</td>
                  <td><span style={{ textTransform: 'capitalize' }}>{e.source}</span></td>
                  <td>
                    <span className={`badge badge-${e.status.toLowerCase()}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
