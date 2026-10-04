import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Public Client for Supabase Auth in Client Components
 */
export function getSupabaseAuthClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon key missing in environment');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Server-only Admin Client with Service Role (Bypasses RLS for admin tasks)
 * NEVER send service key to browser components!
 */
export function getSupabaseServerAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Server environment missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
