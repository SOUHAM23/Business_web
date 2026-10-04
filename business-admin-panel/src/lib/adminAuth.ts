import { getSupabaseServerAdmin } from './supabaseAdmin';

/**
 * Verify if an authenticated email address belongs to an active Admin user.
 * BLOCKS any unauthorized Google account from accessing admin routes!
 */
export async function verifyAdminEmailAllowlist(email: string): Promise<{ authorized: boolean; role?: string }> {
  if (!email) return { authorized: false };

  try {
    const supabase = getSupabaseServerAdmin();
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role, active')
      .eq('email', email.toLowerCase())
      .eq('active', true)
      .single();

    if (error || !adminUser) {
      console.warn(`[SECURITY] Unauthorized login attempt blocked for email: ${email}`);
      return { authorized: false };
    }

    return { authorized: true, role: adminUser.role };
  } catch (err) {
    return { authorized: false };
  }
}
