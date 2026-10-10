import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/serverAuth';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Ensure all auth cookies are thoroughly wiped
    const allCookies = request.cookies.getAll();
    for (const cookie of allCookies) {
      if (cookie.name.includes('sb-') || cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        response.cookies.set(cookie.name, '', {
          maxAge: 0,
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }
    }

    return response;
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
