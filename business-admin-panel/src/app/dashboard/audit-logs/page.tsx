'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setLogs(data);
    setLoading(false);
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">System & Administrative Audit Logs</h1>
        <button onClick={fetchLogs} className="btn btn-secondary">🔄 Refresh Logs</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Resource Type</th>
              <th>Resource ID</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading audit logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>No security audit logs recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString('en-IN')}</td>
                  <td><strong style={{ color: '#f59e0b' }}>{log.action}</strong></td>
                  <td>{log.resource_type}</td>
                  <td>{log.resource_id || 'N/A'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {JSON.stringify(log.metadata || {})}
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
