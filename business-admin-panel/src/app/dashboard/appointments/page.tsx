'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase
      .from('appointments')
      .select('id, service, preferred_date, preferred_time, status, notes, created_at, customers(name, phone, email)')
      .order('preferred_date', { ascending: true });

    if (data) setAppointments(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const supabase = getSupabaseAuthClient();
    await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    fetchAppointments();
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Appointment Booking Scheduler</h1>
        <button onClick={fetchAppointments} className="btn btn-secondary">🔄 Refresh</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preferred Date</th>
              <th>Time Slot</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>Loading appointments...</td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>No appointments scheduled yet.</td>
              </tr>
            ) : (
              appointments.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.preferred_date}</strong></td>
                  <td>{item.preferred_time || 'Morning'}</td>
                  <td>{item.customers?.name || 'Lead'}</td>
                  <td>{item.customers?.phone || 'N/A'}</td>
                  <td>{item.service}</td>
                  <td>
                    <span className={`badge ${item.status === 'CONFIRMED' ? 'badge-resolved' : item.status === 'PENDING' ? 'badge-contacted' : 'badge-failed'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="input-select"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
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
