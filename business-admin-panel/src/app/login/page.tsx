'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const urlError = searchParams.get('error');
  const deniedEmail = searchParams.get('email');

  useEffect(() => {
    if (urlError === 'unauthorized_email') {
      setStatus('error');
      setErrorMsg(
        deniedEmail
          ? `Access Denied: Account (${deniedEmail}) is not registered in the Sanchay Path Super Admin allowlist.`
          : 'Access Denied: This Google account is not authorized to access the admin portal.'
      );
    } else if (urlError === 'oauth_exchange_failed') {
      setStatus('error');
      setErrorMsg('Authentication failed during secure token exchange. Please try again.');
    } else if (urlError) {
      setStatus('error');
      setErrorMsg(`Authentication error: ${urlError}`);
    }

    // Check if user already has an active session
    const checkActiveSession = async () => {
      try {
        const supabase = getSupabaseAuthClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.replace(returnTo);
        }
      } catch {}
    };
    checkActiveSession();
  }, [urlError, deniedEmail, returnTo, router]);

  const handleGoogleLogin = async () => {
    try {
      setStatus('loading');
      setErrorMsg('');
      const supabase = getSupabaseAuthClient();

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = `${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          scopes: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setStatus('error');
        if (error.message.includes('provider is not enabled') || error.message.includes('validation_failed')) {
          setErrorMsg('Google OAuth Provider is currently disabled in your Supabase Project Auth Settings.');
        } else {
          setErrorMsg(error.message);
        }
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('Google OAuth initialization failed. Please check network connection.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.1)',
          textAlign: 'center',
        }}
      >
        {/* Brand Logo & Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.25rem',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
            }}
          >
            🛡️
          </div>
          <h1
            style={{
              color: '#ffffff',
              fontSize: '1.85rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
            }}
          >
            Sanchay Path Admin
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.5' }}>
            Authorized Super Admin Management Portal
          </p>
        </div>

        {/* Error Alert Box */}
        {status === 'error' && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              color: '#f87171',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Single Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={status === 'loading'}
          type="button"
          style={{
            width: '100%',
            padding: '0.95rem 1.25rem',
            borderRadius: '14px',
            background: status === 'loading' ? '#334155' : '#ffffff',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            cursor: status === 'loading' ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          {/* Google G Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{status === 'loading' ? 'Connecting to Google...' : 'Sign In with Google'}</span>
        </button>

        {/* Security Footer Notice */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p
            style={{
              fontSize: '0.78rem',
              color: '#64748b',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            🔒 Restricted Access. Only pre-authorized Google Super Admin accounts are granted portal access. Sessions remain securely active for 12 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
      <AdminLoginContent />
    </Suspense>
  );
}
