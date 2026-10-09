'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function ContentEditorPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [contactEmailInput, setContactEmailInput] = useState('contact@sanchaypath.com');
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase.from('site_content').select('*').order('content_key');
    
    if (data) {
      setContents(data);
      const emailItem = data.find((c: any) => c.content_key === 'contact_email');
      if (emailItem && emailItem.content_value) {
        setContactEmailInput(emailItem.content_value);
      } else {
        // Auto-provision contact_email in DB if not present
        await supabase.from('site_content').upsert(
          {
            content_key: 'contact_email',
            content_value: 'contact@sanchaypath.com',
            content_type: 'text',
            is_published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'content_key' }
        );
        setContactEmailInput('contact@sanchaypath.com');
      }
    }
    setLoading(false);
  }

  function handleContentChange(key: string, newValue: string) {
    setContents(contents.map((c: any) => (c.content_key === key ? { ...c, content_value: newValue, is_published: false } : c)));
  }

  async function handleSaveContactEmail() {
    setIsSavingEmail(true);
    setSaveStatus('Publishing official contact email to public website...');
    const supabase = getSupabaseAuthClient();
    
    await supabase.from('site_content').upsert(
      {
        content_key: 'contact_email',
        content_value: contactEmailInput.trim(),
        content_type: 'text',
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'content_key' }
    );

    // Revalidate public static cache
    try {
      await fetch('/api/revalidate?path=/', { method: 'POST' });
    } catch (e) {}

    setSaveStatus(`✅ Official contact email updated to "${contactEmailInput.trim()}"!`);
    setIsSavingEmail(false);
    fetchContents();
  }

  async function handleSaveDraft(item: any) {
    setSaveStatus('Saving Draft...');
    const supabase = getSupabaseAuthClient();
    await supabase.from('site_content').update({
      content_value: item.content_value,
      is_published: false,
      updated_at: new Date().toISOString(),
    }).eq('content_key', item.content_key);
    setSaveStatus(`Draft saved for ${item.content_key}!`);
    fetchContents();
  }

  async function handlePublish(item: any) {
    setSaveStatus('Publishing & Triggering ISR Revalidation...');
    const supabase = getSupabaseAuthClient();
    await supabase.from('site_content').update({
      content_value: item.content_value,
      is_published: true,
      updated_at: new Date().toISOString(),
    }).eq('content_key', item.content_key);

    try {
      await fetch('/api/revalidate?path=/', { method: 'POST' });
    } catch (e) {}

    setSaveStatus(`Published ${item.content_key} to Live Public Website!`);
    fetchContents();
  }

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Website Content Management (CMS)</h1>
        <button onClick={fetchContents} className="btn btn-secondary">🔄 Refresh</button>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Edit structured website content for Sanchay Path. Save drafts to test or click <strong>Publish</strong> to update the live public website.
      </p>

      {saveStatus && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
          {saveStatus}
        </div>
      )}

      {/* DEDICATED OFFICIAL CONTACT EMAIL EDITING CARD */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.45)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>📧</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>Official Website Contact Email</h2>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          This is the primary email address displayed on the public website (contact section & advisory helpline). When users click it, their default email client opens with this address pre-filled as recipient (<code style={{ color: '#fbbf24' }}>mailto:</code> link).
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="email"
            value={contactEmailInput}
            onChange={(e) => setContactEmailInput(e.target.value)}
            placeholder="e.g. contact@sanchaypath.com"
            style={{
              flex: '1',
              minWidth: '280px',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#0f172a',
              border: '1px solid #f59e0b',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSaveContactEmail}
            disabled={isSavingEmail}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem', fontWeight: 700 }}
          >
            {isSavingEmail ? 'Saving...' : '💾 Save & Publish Email to Site'}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
        📁 All Structured Site Content Keys
      </h2>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading CMS fields...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {contents.map((item) => (
            <div key={item.id || item.content_key} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#f59e0b' }}>{item.content_key}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Type: {item.content_type}</span>
                </div>
                <span className={`badge ${item.is_published ? 'badge-resolved' : 'badge-contacted'}`}>
                  {item.is_published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>

              {item.content_type === 'text' && (
                <textarea
                  rows={item.content_value && item.content_value.length > 80 ? 3 : 1}
                  value={item.content_value || ''}
                  onChange={(e) => handleContentChange(item.content_key, e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem' }}
                />
              )}

              {item.content_type === 'json' && (
                <textarea
                  rows={6}
                  value={item.content_value || ''}
                  onChange={(e) => handleContentChange(item.content_key, e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#10b981', fontFamily: 'monospace', fontSize: '0.85rem', outline: 'none', marginBottom: '1rem' }}
                />
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => handleSaveDraft(item)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  💾 Save Draft
                </button>
                <button onClick={() => handlePublish(item)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  🚀 Publish to Site
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
