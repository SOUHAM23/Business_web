'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase
      .from('enquiries')
      .select('id, service, source, message, status, created_at, customers(name, phone, email, location)')
      .order('created_at', { ascending: false });

    if (data) setEnquiries(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const supabase = getSupabaseAuthClient();
    await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    fetchEnquiries();
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Enquiries & Lead Management</h1>
        <button onClick={fetchEnquiries} className="btn btn-secondary">🔄 Refresh</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Service</th>
              <th>Source</th>
              <th>Message</th>
              <th>Status Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading enquiries...</td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8' }}>No enquiries found.</td>
              </tr>
            ) : (
              enquiries.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                  <td><strong>{item.customers?.name || 'Lead'}</strong></td>
                  <td>{item.customers?.phone || 'N/A'}</td>
                  <td>{item.customers?.email || 'N/A'}</td>
                  <td>{item.service}</td>
                  <td><span style={{ textTransform: 'capitalize' }}>{item.source}</span></td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.message || 'N/A'}
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="input-select"
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
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
