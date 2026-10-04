'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function BackupsPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackupLogs();
  }, []);

  async function fetchBackupLogs() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase.from('backup_runs').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setBackups(data);
    setLoading(false);
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Encrypted Google Drive Backups</h1>
        <button onClick={fetchBackupLogs} className="btn btn-secondary">🔄 Refresh Logs</button>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#10b981', marginBottom: '0.5rem' }}>🛡️ AES-256-GCM Encrypted Security Strategy</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
          Daily automated database backups are generated via isolated GitHub Actions/Ops runner, encrypted using AES-256-GCM before transport, signed with SHA-256 checksums, and uploaded to a private Google Drive backup folder.
        </p>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Backup Run Logs</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Started At</th>
              <th>Backup Type</th>
              <th>Status</th>
              <th>SHA-256 Checksum</th>
              <th>Storage Reference</th>
              <th>Error Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading backup history...</td>
              </tr>
            ) : backups.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>No backup runs logged yet. (Daily backup schedule active)</td>
              </tr>
            ) : (
              backups.map((b) => (
                <tr key={b.id}>
                  <td>{new Date(b.started_at).toLocaleString('en-IN')}</td>
                  <td>{b.backup_type}</td>
                  <td>
                    <span className={`badge ${b.status === 'SUCCESS' ? 'badge-resolved' : 'badge-failed'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#f59e0b' }}>
                    {b.checksum ? b.checksum.substring(0, 16) + '...' : 'N/A'}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{b.storage_reference || 'Google Drive'}</td>
                  <td style={{ color: b.error_message ? '#ef4444' : '#94a3b8' }}>
                    {b.error_message || 'None (Clean)'}
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
