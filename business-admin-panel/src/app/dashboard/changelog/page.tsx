'use client';

import { useEffect, useState } from 'react';

export default function ChangelogPage() {
  const [markdown, setMarkdown] = useState('');
  const [latestCommit, setLatestCommit] = useState('');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChangelog();
  }, []);

  async function fetchChangelog() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/changelog');
      if (res.ok) {
        const json = await res.json();
        setMarkdown(json.content || '');
        setLatestCommit(json.latestCommit || '3799309');
        setBranch(json.branch || 'main');
      }
    } catch (err) {
      console.error('Failed to load changelog:', err);
    } finally {
      setLoading(false);
    }
  }

  const parseChangelogSections = (mdText: string) => {
    const lines = mdText.split('\n');
    const releases: Array<{ title: string; date: string; tag?: string; items: string[] }> = [];
    let currentRelease: { title: string; date: string; tag?: string; items: string[] } | null = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentRelease) releases.push(currentRelease);
        const titleMatch = line.replace('## ', '').trim();
        currentRelease = {
          title: titleMatch,
          date: titleMatch.includes('-') ? titleMatch.split('-')[1]?.trim() || '' : '',
          tag: titleMatch.includes('`commit') ? titleMatch.match(/`commit ([a-f0-9]+)`/)?.[1] : undefined,
          items: [],
        };
      } else if (currentRelease && line.trim()) {
        currentRelease.items.push(line);
      }
    }
    if (currentRelease) releases.push(currentRelease);
    return releases;
  };

  const releases = parseChangelogSections(markdown);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Header Bar */}
      <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            📋 Recent Updates & Changelog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Track recent system enhancements, git commits, UI updates, and architecture releases.
          </p>
        </div>
        <button onClick={fetchChangelog} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🔄 Refresh Log
        </button>
      </div>

      {/* Metadata Pill */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
          🌿 Branch: <code>{branch}</code>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
          📌 Latest Commit: <code>{latestCommit}</code>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.35)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600 }}>
          📝 Tracked File: <code>CHANGELOG.md</code>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading changelog records...
        </div>
      ) : releases.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {releases.map((rel, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem 1.75rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {rel.title}
                </h2>
                {rel.tag && (
                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: '12px', fontFamily: 'monospace' }}>
                    Git Tag: {rel.tag}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {rel.items.map((line, lIdx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={lIdx} style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        <span style={{ color: 'var(--accent-gold)', flexShrink: 0 }}>•</span>
                        <span>{line.replace('- ', '')}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={lIdx} style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <pre style={{ background: '#0f172a', color: '#f8fafc', padding: '1.5rem', borderRadius: '12px', overflowX: 'auto', fontSize: '0.9rem', lineHeight: '1.6' }}>
          {markdown}
        </pre>
      )}
    </div>
  );
}
