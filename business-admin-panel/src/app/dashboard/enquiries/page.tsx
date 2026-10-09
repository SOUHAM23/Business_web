'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Modal State for reading full message
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase
      .from('enquiries')
      .select('id, service, source, message, status, age, created_at, customers(name, phone, email, location, age)')
      .order('created_at', { ascending: false });

    if (data) setEnquiries(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const supabase = getSupabaseAuthClient();
    await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev: any) => ({ ...prev, status: newStatus }));
    }
  }

  // Extract unique services dynamically from database records
  const uniqueServices = Array.from(
    new Set(enquiries.map((e) => e.service).filter(Boolean))
  );

  // Filtered & Sorted Enquiries
  const filteredEnquiries = enquiries
    .filter((item) => {
      // Service filter
      if (selectedService !== 'ALL' && item.service !== selectedService) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }
      // Age Group Filter
      const leadAge = item.age || item.customers?.age;
      if (selectedAgeGroup === '18-30') {
        if (!leadAge || leadAge < 18 || leadAge > 30) return false;
      } else if (selectedAgeGroup === '31-50') {
        if (!leadAge || leadAge < 31 || leadAge > 50) return false;
      } else if (selectedAgeGroup === '51-99') {
        if (!leadAge || leadAge < 51 || leadAge > 99) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.customers?.name?.toLowerCase().includes(q);
        const phoneMatch = item.customers?.phone?.includes(q);
        const emailMatch = item.customers?.email?.toLowerCase().includes(q);
        const serviceMatch = item.service?.toLowerCase().includes(q);
        const messageMatch = item.message?.toLowerCase().includes(q);
        const ageMatch = String(leadAge || '').includes(q);
        if (!nameMatch && !phoneMatch && !emailMatch && !serviceMatch && !messageMatch && !ageMatch) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedService('ALL');
    setSelectedStatus('ALL');
    setSelectedAgeGroup('ALL');
    setSortBy('newest');
  };

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">Enquiries & Lead Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Filter, search, and respond to incoming customer enquiries.
          </p>
        </div>
        <button onClick={fetchEnquiries} className="btn btn-secondary">🔄 Refresh</button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="filter-controls-bar">
        <div className="filter-group-left">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search customer, phone, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Service Filter */}
          <div className="filter-select-wrapper">
            <label className="filter-label">Service:</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Services</option>
              {uniqueServices.map((serviceName) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-select-wrapper">
            <label className="filter-label">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* Age Group Filter */}
          <div className="filter-select-wrapper">
            <label className="filter-label">Age Group:</label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Ages</option>
              <option value="18-30">18 – 30 Years (Young)</option>
              <option value="31-50">31 – 50 Years (Mid Career)</option>
              <option value="51-99">51 – 99 Years (Senior)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="filter-select-wrapper">
            <label className="filter-label">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="filter-group-right">
          <span className="filter-counter-badge">
            Showing <strong>{filteredEnquiries.length}</strong> of {enquiries.length}
          </span>
          {(searchQuery || selectedService !== 'ALL' || selectedStatus !== 'ALL' || selectedAgeGroup !== 'ALL' || sortBy !== 'newest') && (
            <button onClick={resetFilters} className="btn-reset-filters">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ENQUIRIES TABLE */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Age</th>
              <th>Service</th>
              <th>Source</th>
              <th>Message</th>
              <th>Status Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  Loading enquiries...
                </td>
              </tr>
            ) : filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  No matching enquiries found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((item) => {
                const rawPhone = item.customers?.phone || '';
                const cleanPhone = rawPhone.replace(/\D/g, '');
                const leadAge = item.age || item.customers?.age;
                return (
                  <tr key={item.id} className="enquiry-row">
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {new Date(item.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <strong>{item.customers?.name || 'Lead'}</strong>
                    </td>
                    <td>
                      {rawPhone ? (
                        <a href={`tel:${rawPhone}`} className="table-link" title="Call Phone">
                          📞 {rawPhone}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      {item.customers?.email ? (
                        <a href={`mailto:${item.customers.email}`} className="table-link" title="Send Email">
                          ✉️ {item.customers.email}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <strong style={{ color: '#f59e0b', fontSize: '0.88rem' }}>
                        {leadAge ? `${leadAge} yrs` : 'N/A'}
                      </strong>
                    </td>
                    <td>
                      <span className="service-pill">{item.service}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', color: '#94a3b8', fontSize: '0.82rem' }}>
                        {item.source}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div className="message-cell-wrapper">
                        <span className="message-text-preview">{item.message || 'No message content.'}</span>
                        <button
                          type="button"
                          className="btn-read-msg"
                          onClick={() => setSelectedItem(item)}
                          title="Click to view full message & lead details"
                        >
                          💬 Read Full
                        </button>
                      </div>
                    </td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`input-select status-select status-${item.status?.toLowerCase()}`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FULL MESSAGE & LEAD DETAIL MODAL */}
      {selectedItem && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Lead & Enquiry Details</h3>
                <span className="modal-subtitle">Received on {new Date(selectedItem.created_at).toLocaleString('en-IN')}</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedItem(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Contact Details */}
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-info-label">Customer Name</span>
                  <span className="modal-info-val">{selectedItem.customers?.name || 'Unspecified Lead'}</span>
                </div>

                <div className="modal-info-item">
                  <span className="modal-info-label">Service Interested</span>
                  <span className="modal-info-val green">{selectedItem.service}</span>
                </div>

                <div className="modal-info-item">
                  <span className="modal-info-label">Phone Number</span>
                  <span className="modal-info-val">
                    {selectedItem.customers?.phone ? (
                      <a href={`tel:${selectedItem.customers.phone}`} className="modal-link">
                        📞 {selectedItem.customers.phone}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>

                <div className="modal-info-item">
                  <span className="modal-info-label">Email Address</span>
                  <span className="modal-info-val">
                    {selectedItem.customers?.email ? (
                      <a href={`mailto:${selectedItem.customers.email}`} className="modal-link">
                        ✉️ {selectedItem.customers.email}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
              </div>

              {/* Full Message Section */}
              <div className="modal-message-box">
                <span className="modal-info-label">Full Customer Message</span>
                <div className="modal-message-content">
                  {selectedItem.message ? selectedItem.message : 'No message was provided.'}
                </div>
              </div>

              {/* Quick Communication Actions */}
              <div className="modal-actions-bar">
                <span className="modal-info-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Quick Communication & Actions:
                </span>
                <div className="modal-buttons-group">
                  {selectedItem.customers?.phone && (
                    <a
                      href={`https://wa.me/91${selectedItem.customers.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                        selectedItem.customers.name || ''
                      )},%20thank%20you%20for%20contacting%20Sanchay%20Path.%20Regarding%20your%20enquiry%20for%20${encodeURIComponent(
                        selectedItem.service
                      )}:`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-modal-action whatsapp-btn"
                    >
                      💬 Chat on WhatsApp
                    </a>
                  )}
                  {selectedItem.customers?.phone && (
                    <a href={`tel:${selectedItem.customers.phone}`} className="btn-modal-action call-btn">
                      📞 Call Customer
                    </a>
                  )}
                  {selectedItem.customers?.email && (
                    <a
                      href={`mailto:${selectedItem.customers.email}?subject=Response%20to%20your%20Sanchay%20Path%20Enquiry`}
                      className="btn-modal-action email-btn"
                    >
                      ✉️ Email Customer
                    </a>
                  )}
                </div>
              </div>

              {/* Status Selector in Modal */}
              <div className="modal-status-bar">
                <span className="modal-info-label">Update Enquiry Status:</span>
                <div className="modal-status-pills">
                  {['NEW', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`status-pill-btn ${selectedItem.status === st ? 'active' : ''}`}
                      onClick={() => updateStatus(selectedItem.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
