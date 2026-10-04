'use client';

import { useState } from 'react';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const supabase = getSupabaseAuthClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus('error');
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('Login failed. Please check credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseAuthClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: '#0f172a' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#f59e0b', fontSize: '1.75rem', fontWeight: 700 }}>Sanchay Path Admin</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Secure Portal Access</p>
        </div>

        {status === 'error' && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sanchaypath.com"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {status === 'loading' ? 'Authenticating...' : 'Sign In with Email'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#334155' }} />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#334155' }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <span>🌐 Sign In with Google OAuth</span>
        </button>
      </div>
    </div>
  );
}
