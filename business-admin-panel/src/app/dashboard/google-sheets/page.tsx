'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function GoogleSheetsPage() {
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchSyncState();
    fetchExportLogs();
    checkGoogleToken();
  }, []);

  async function checkGoogleToken() {
    try {
      const supabase = getSupabaseAuthClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.provider_token) {
        setHasGoogleToken(true);
      }
    } catch (e) {
      // Ignored
    }
  }

  async function fetchSyncState() {
    try {
      const res = await fetch('/api/admin/trigger-sheet-export');
      const data = await res.json();
      if (data.success) {
        setPendingCount(data.pendingCount || 0);
        setLastSyncedAt(data.lastSyncedAt ? new Date(data.lastSyncedAt).toLocaleString('en-IN') : 'Never');
      }
    } catch (e) {
      console.error('Failed to fetch sync state:', e);
    }
  }

  async function fetchExportLogs() {
    setLoading(true);
    try {
      const supabase = getSupabaseAuthClient();
      const { data } = await supabase
        .from('sheet_exports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setExports(data);
    } catch (e) {
      console.error('Failed to fetch export logs:', e);
    }
    setLoading(false);
  }

  async function handleConnectGoogle() {
    try {
      const supabase = getSupabaseAuthClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
          redirectTo: `${window.location.origin}/dashboard/google-sheets`,
        },
      });
    } catch (e: any) {
      setTriggerStatus(`Google Sign-in Error: ${e.message || 'Failed to initiate OAuth'}`);
    }
  }

  async function handleSyncNow() {
    setSyncing(true);
    setTriggerStatus('Synchronizing pending leads to Google Sheets...');
    try {
      const supabase = getSupabaseAuthClient();
      const { data: { session } } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;

      const res = await fetch('/api/admin/trigger-sheet-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(providerToken ? { 'x-google-user-token': providerToken } : {}),
        },
        body: JSON.stringify({
          userAccessToken: providerToken || null,
          forceSync: true, // Sync ALL pending leads immediately
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTriggerStatus(`✅ ${data.message || 'Synchronized leads successfully!'}`);
      } else {
        setTriggerStatus(`❌ Sync Failed: ${data.error || 'Authentication required'}`);
      }
    } catch (e: any) {
      setTriggerStatus(`❌ Error: ${e.message || 'Server error during sync'}`);
    }
    setSyncing(false);
    fetchSyncState();
    fetchExportLogs();
  }

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">Google Sheets Synchronization</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Batch-based synchronization for website and WhatsApp leads.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleConnectGoogle} className="btn" style={{ background: '#3b82f6', color: '#fff' }}>
            🔑 {hasGoogleToken ? 'Reconnect Google Account' : 'Connect Google Account'}
          </button>
        </div>
      </div>

      {/* SYNC STATUS DASHBOARD PANEL */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📊 Google Sheets Sync Status
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Status</span>
            <span style={{ color: hasGoogleToken ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: '1.05rem' }}>
              {hasGoogleToken ? '🟢 Connected' : '🔑 Needs Google OAuth Connection'}
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Last Synced</span>
            <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>
              {lastSyncedAt}
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Pending Leads</span>
            <span style={{ color: pendingCount > 0 ? '#f59e0b' : '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>
              {pendingCount} lead(s)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="btn btn-primary"
              style={{ width: '100%', minHeight: '48px', fontSize: '1rem' }}
            >
              {syncing ? '⏳ Syncing...' : '🔄 Sync Now'}
            </button>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
          * Leads automatically sync in <strong>batches of 4</strong>. Clicking <strong>Sync Now</strong> immediately synchronizes ALL currently pending leads to Google Sheets, even if fewer than 4.
        </p>
      </div>

      {triggerStatus && (
        <div style={{ background: triggerStatus.startsWith('✅') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${triggerStatus.startsWith('✅') ? '#10b981' : '#ef4444'}`, color: triggerStatus.startsWith('✅') ? '#10b981' : '#f87171', padding: '0.85rem 1.1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          {triggerStatus}
        </div>
      )}

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Synchronization History Log</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Trigger Type</th>
              <th>Sync Status</th>
              <th>Rows Synced</th>
              <th>Log Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading export history...</td>
              </tr>
            ) : exports.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>No sync runs logged yet.</td>
              </tr>
            ) : (
              exports.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.created_at || e.createdAt).toLocaleString('en-IN')}</td>
                  <td>{e.type}</td>
                  <td>
                    <span className={`badge ${e.status === 'SUCCESS' ? 'badge-resolved' : 'badge-failed'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td><strong>{e.row_count || e.rowCount || 0}</strong> rows</td>
                  <td style={{ color: e.error_message || e.errorMessage ? '#ef4444' : '#94a3b8' }}>
                    {e.error_message || e.errorMessage || 'Clean Run'}
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
