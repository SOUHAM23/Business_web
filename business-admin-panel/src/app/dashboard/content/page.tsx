'use client';

import { useEffect, useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

export default function ContentEditorPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    setLoading(true);
    const supabase = getSupabaseAuthClient();
    const { data } = await supabase.from('site_content').select('*').order('content_key');
    if (data) setContents(data);
    setLoading(false);
  }

  function handleContentChange(key: string, newValue: string) {
    setContents(contents.map((c) => (c.content_key === key ? { ...c, content_value: newValue, is_published: false } : c)));
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

    // Call ISR Cache Revalidation API
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
        Edit structured website content for Sanchay Path. Save drafts to test or click <strong>Publish</strong> to update the live public website and revalidate static cache.
      </p>

      {saveStatus && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          ✅ {saveStatus}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading CMS fields...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {contents.map((item) => (
            <div key={item.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' }}>
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
                  rows={item.content_value.length > 80 ? 3 : 1}
                  value={item.content_value}
                  onChange={(e) => handleContentChange(item.content_key, e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem' }}
                />
              )}

              {item.content_type === 'json' && (
                <textarea
                  rows={6}
                  value={item.content_value}
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
