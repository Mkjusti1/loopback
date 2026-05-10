import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from './SignOutButton';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: memberships } = await supabase
    .from('org_members')
    .select('*, organizations(*)')
    .eq('user_id', user.id);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}
        >
          Loopback
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
          >
            {user.email}
          </span>
          <SignOutButton />
        </div>
      </nav>

      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}
          >
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Here are your workspaces
          </p>
        </div>

        {memberships && memberships.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {memberships.map((m: any) => (
              <a
                key={m.id}
                href={`/dashboard/org/${m.organizations.id}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                  >
                    {m.organizations.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginTop: '0.2rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {m.role}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'var(--bg)',
                    color: 'var(--text-secondary)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                  }}
                >
                  {m.organizations.slug}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              You are not part of any workspace yet.
            </p>
            <a
              href='/dashboard/create-org'
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                background: 'var(--accent)',
                color: 'white',
                padding: '0.625rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Create workspace
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
