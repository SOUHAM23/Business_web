'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('ALL');

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

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = c.name?.toLowerCase().includes(q);
      const phoneMatch = c.phone?.includes(q);
      const emailMatch = c.email?.toLowerCase().includes(q);
      if (!nameMatch && !phoneMatch && !emailMatch) return false;
    }
    if (selectedAgeGroup === '18-30') {
      if (!c.age || c.age < 18 || c.age > 30) return false;
    } else if (selectedAgeGroup === '31-50') {
      if (!c.age || c.age < 31 || c.age > 50) return false;
    } else if (selectedAgeGroup === '51-99') {
      if (!c.age || c.age < 51 || c.age > 99) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">Customer Directory (CRM)</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            View client profiles, age demographics, and contact details.
          </p>
        </div>
        <button onClick={fetchCustomers} className="btn btn-secondary">🔄 Refresh</button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="filter-controls-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Search by customer name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
            style={{ width: '100%', padding: '0.5rem 0.85rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.9rem' }}
          />
        </div>

        <div className="filter-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="filter-label" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>Age Demographic:</label>
          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="filter-select"
            style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.9rem' }}
          >
            <option value="ALL">All Ages</option>
            <option value="18-30">18 – 30 Years (Young Investors)</option>
            <option value="31-50">31 – 50 Years (Mid Career)</option>
            <option value="51-99">51 – 99 Years (Senior / Retirement)</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Joined Date</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Age</th>
              <th>Location</th>
              <th>Gender / Marital</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading customer directory...</td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No customer profiles found matching filters.</td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td><strong>{c.name || 'Anonymous'}</strong></td>
                  <td>{c.phone}</td>
                  <td>{c.email || 'N/A'}</td>
                  <td><strong style={{ color: '#f59e0b' }}>{c.age ? `${c.age} yrs` : 'N/A'}</strong></td>
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
