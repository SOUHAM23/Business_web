import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerAdmin } from './supabaseAdmin';

export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 Hours = 43,200 seconds

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates a server Supabase client for Server Components & Route Handlers
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              maxAge: SESSION_MAX_AGE_SECONDS,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if middleware handles cookie refreshing.
        }
      },
    },
  });
}

/**
 * Creates a server Supabase client specifically for Next.js Middleware
 */
export function createMiddlewareSupabaseClient(request: NextRequest, response: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
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
}

/**
 * Verifies if an email belongs to an active administrator in admin_users table
 */
export async function verifyAdminStatus(email: string | null | undefined): Promise<{ isAuthorized: boolean; role?: string }> {
  if (!email) return { isAuthorized: false };

  try {
    const adminClient = getSupabaseServerAdmin();
    const { data, error } = await adminClient
      .from('admin_users')
      .select('role, active')
      .eq('email', email.toLowerCase())
      .eq('active', true)
      .single();

    if (error || !data) {
      return { isAuthorized: false };
    }
    return { isAuthorized: true, role: data.role };
  } catch (err) {
    console.error('Error verifying admin status:', err);
    return { isAuthorized: false };
  }
}

/**
 * Validates the current user session and admin authorization on the server.
 * Returns the user and admin status or null if unauthenticated.
 */
export async function getAuthenticatedAdminServer() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return null;
    }

    const { isAuthorized, role } = await verifyAdminStatus(user.email);
    if (!isAuthorized) {
      return null;
    }

    return {
      user,
      email: user.email,
      role,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
    };
  } catch (err) {
    console.error('getAuthenticatedAdminServer error:', err);
    return null;
  }
}
