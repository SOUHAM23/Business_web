import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminStatus, SESSION_MAX_AGE_SECONDS } from '@/lib/serverAuth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { access_token, refresh_token, email } = body;

    if (!access_token || !email) {
      return NextResponse.json(
        { authorized: false, error: 'missing_payload', message: 'Access token and email are required' },
        { status: 400 }
      );
    }

    // 1. Validate email against admin_users allowlist
    const { isAuthorized, role } = await verifyAdminStatus(email);

    if (!isAuthorized) {
      console.warn(`[SECURITY] Blocked unauthorized session setup for: ${email}`);
      return NextResponse.json(
        {
          authorized: false,
          error: 'unauthorized_email',
          message: 'Account is not in the authorized administrator allowlist',
        },
        { status: 403 }
      );
    }

    // 2. Prepare response with 12-hour cookies
    const cookieStore = await cookies();
    const response = NextResponse.json({
      authorized: true,
      role: role || 'ADMIN',
      email: email,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              maxAge: SESSION_MAX_AGE_SECONDS,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
            response.cookies.set(name, value, {
              ...options,
              maxAge: SESSION_MAX_AGE_SECONDS,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          });
        },
      },
    });

    // Sync session into SSR cookie store
    await supabase.auth.setSession({
      access_token,
      refresh_token: refresh_token || '',
    });

    console.log(`[AUTH] 12-hour admin session successfully synchronized for: ${email}`);
    return response;
  } catch (err: any) {
    console.error('[AUTH API] Session synchronization error:', err);
    return NextResponse.json({ authorized: false, error: err.message }, { status: 500 });
  }
}
