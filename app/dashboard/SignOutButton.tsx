'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        padding: '0.375rem 0.875rem',
        borderRadius: '8px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      Sign out
    </button>
  );
}
