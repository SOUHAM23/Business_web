'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function GoogleSheetsPage() {
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState(false);

  useEffect(() => {
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

  async function handleManualSync() {
    setTriggerStatus('Triggering Google Sheet Snapshot Export...');
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
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTriggerStatus(`✅ ${data.message || `Exported ${data.rows} rows successfully!`}`);
      } else {
        setTriggerStatus(`❌ Export Failed: ${data.error || 'Authentication required'}`);
      }
    } catch (e: any) {
      setTriggerStatus(`❌ Error: ${e.message || 'Server error triggering export'}`);
    }
    fetchExportLogs();
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Google Sheet Snapshot Export</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleConnectGoogle} className="btn" style={{ background: '#3b82f6', color: '#fff' }}>
            🔑 {hasGoogleToken ? 'Reconnect Google Account' : 'Connect Google Account'}
          </button>
          <button onClick={handleManualSync} className="btn btn-primary">
            🚀 Trigger Export Now
          </button>
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#f59e0b', marginBottom: '0.5rem' }}>ℹ️ How Google Sheet Sync Works & How to Fix Connection</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          Google Sheets acts as an <strong>Output Snapshot</strong> for reporting purposes. You can connect your Google Account in 2 ways:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <strong style={{ color: '#60a5fa', display: 'block', marginBottom: '0.35rem' }}>Option 1: 1-Click Google OAuth (Recommended)</strong>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Click <strong>"🔑 Connect Google Account"</strong> above. Sign in with Google to grant Drive & Sheets permission. The system will automatically create a <code>Sanchay Business</code> folder and <code>Business Leads</code> sheet in your Google Drive!
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.35rem' }}>Option 2: Service Account Environment Variables</strong>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Add <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code>, <code>GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</code>, and <code>GOOGLE_SPREADSHEET_ID</code> to your server environment variables (Vercel / .env).
            </p>
          </div>
        </div>
      </div>

      {triggerStatus && (
        <div style={{ background: triggerStatus.startsWith('✅') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${triggerStatus.startsWith('✅') ? '#10b981' : '#ef4444'}`, color: triggerStatus.startsWith('✅') ? '#10b981' : '#f87171', padding: '0.85rem 1.1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          {triggerStatus}
        </div>
      )}

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Export Execution History</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Export Status</th>
              <th>Rows Exported</th>
              <th>Error Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading export history...</td>
              </tr>
            ) : exports.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>No sheet export runs logged yet.</td>
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
                    {e.error_message || e.errorMessage || 'None (Clean Run)'}
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

