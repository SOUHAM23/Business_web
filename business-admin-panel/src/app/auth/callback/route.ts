import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, verifyAdminStatus } from '@/lib/serverAuth';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  if (!code) {
    // If no authorization code provided, redirect to login
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user || !data.user.email) {
      console.error('[AUTH CALLBACK] Failed to exchange code for session:', error);
      return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
    }

    // Verify authenticated Google email against pre-approved admin_users allowlist
    const { isAuthorized, role } = await verifyAdminStatus(data.user.email);

    if (!isAuthorized) {
      console.warn(`[SECURITY] Blocked unauthorized login attempt for email: ${data.user.email}`);
      // Invalidate the session immediately
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=unauthorized_email&email=${encodeURIComponent(data.user.email)}`
      );
    }

    console.log(`[AUTH CALLBACK] Admin logged in: ${data.user.email} (Role: ${role})`);

    // Redirect smoothly to the requested dashboard destination
    const destination = returnTo.startsWith('/dashboard') ? returnTo : '/dashboard';
    return NextResponse.redirect(`${origin}${destination}`);
  } catch (err: any) {
    console.error('[AUTH CALLBACK] Unexpected error during OAuth callback:', err);
    return NextResponse.redirect(`${origin}/login?error=server_error`);
  }
}
