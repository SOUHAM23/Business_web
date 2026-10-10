'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseAuthClient } from '@/lib/supabaseAdmin';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Verifying administrator credentials...');
  const [errorMessage, setErrorMessage] = useState('');

  const urlCode = searchParams.get('code');
  const urlError = searchParams.get('error');
  const urlErrorDescription = searchParams.get('error_description');
  const paramReturnTo = searchParams.get('returnTo');

  useEffect(() => {
    let isCancelled = false;

    async function processAuthentication() {
      // 1. Handle OAuth error query params if passed directly by provider
      if (urlError) {
        const desc = urlErrorDescription || urlError;
        router.replace(`/login?error=${encodeURIComponent(desc)}`);
        return;
      }

      const supabase = getSupabaseAuthClient();
      let savedReturnTo = '/dashboard';
      if (typeof window !== 'undefined') {
        try {
          const stored = sessionStorage.getItem('admin_return_to');
          if (stored && stored.startsWith('/dashboard')) {
            savedReturnTo = stored;
            sessionStorage.removeItem('admin_return_to');
          }
        } catch {}
      }
      const targetDestination = (paramReturnTo && paramReturnTo.startsWith('/dashboard'))
        ? paramReturnTo
        : savedReturnTo;

      try {
        // 2. PKCE Authorization Code Exchange (if present in query string)
        if (urlCode) {
          setStatusMessage('Exchanging authorization code...');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(urlCode);
          if (exchangeError) {
            console.warn('[AUTH] Code exchange error:', exchangeError.message);
          }
        }

        // 3. Extract Session from Supabase client (handles both code exchange and URL hash tokens)
        setStatusMessage('Establishing 12-hour secure session...');
        let { data: { session } } = await supabase.auth.getSession();

        // 4. If session not ready yet, listen for hash fragment resolution
        if (!session || !session.user?.email) {
          session = await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(null), 3500);

            const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, currentSession: any) => {
              if (currentSession?.user?.email) {
                clearTimeout(timeout);
                subscription.unsubscribe();
                resolve(currentSession);
              }
            });
          });
        }

        if (isCancelled) return;

        if (!session || !session.user?.email) {
          console.error('[AUTH] No authenticated session found after callback');
          router.replace('/login?error=no_session');
          return;
        }

        const userEmail = session.user.email.toLowerCase();
        setStatusMessage(`Authorizing Super Admin (${userEmail})...`);

        // 5. Synchronize 12-hour session cookies and check admin allowlist via server API
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            email: userEmail,
          }),
        });

        const authResult = await response.json();

        if (isCancelled) return;

        if (!response.ok || !authResult.authorized) {
          console.warn(`[AUTH] Unauthorized administrator login rejected: ${userEmail}`);
          await supabase.auth.signOut();
          router.replace(`/login?error=unauthorized_email&email=${encodeURIComponent(userEmail)}`);
          return;
        }

        setStatusMessage('Authentication verified. Redirecting to dashboard...');
        // Full navigation ensures middleware receives the fresh 12-hour session cookies
        window.location.href = targetDestination;
      } catch (err: any) {
        console.error('[AUTH] Unexpected callback failure:', err);
        if (!isCancelled) {
          setErrorMessage('Failed to complete authentication. Redirecting to login...');
          setTimeout(() => router.replace('/login?error=auth_exception'), 1500);
        }
      }
    }

    processAuthentication();

    return () => {
      isCancelled = true;
    };
  }, [urlCode, urlError, urlErrorDescription, paramReturnTo, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0f1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #161f36 0%, #0d1527 100%)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.08)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.05))',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
          }}
        >
          🛡️
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
          Sanchay Path Admin
        </h2>

        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '3px solid rgba(245, 158, 11, 0.2)',
              borderTopColor: '#f59e0b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            {errorMessage || statusMessage}
          </p>
        </div>

        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.78rem',
            color: '#64748b',
          }}
        >
          🔒 Persistent 12-Hour Session Verification
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0f1d' }} />
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
