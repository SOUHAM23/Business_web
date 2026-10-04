'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (data) setCustomers(data);
    setLoading(false);
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Customer Directory (CRM)</h1>
        <button onClick={fetchCustomers} className="btn btn-secondary">🔄 Refresh</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Joined Date</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Location</th>
              <th>Gender / Marital</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading customer directory...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>No customer profiles recorded yet.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td><strong>{c.name || 'Anonymous'}</strong></td>
                  <td>{c.phone}</td>
                  <td>{c.email || 'N/A'}</td>
                  <td>{c.location || 'N/A'}</td>
                  <td>{c.gender || 'N/A'} / {c.marital_status || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
