import { redirect } from 'next/navigation';
import { getAuthenticatedAdminServer } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const admin = await getAuthenticatedAdminServer();
  if (admin) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
