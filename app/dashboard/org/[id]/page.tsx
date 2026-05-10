import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (!org) redirect('/dashboard');

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', id)
    .eq('user_id', user.id)
    .single();

  if (!membership) redirect('/dashboard');

  const { data: members } = await supabase
    .from('org_members')
    .select('*, profiles(*)')
    .eq('org_id', id);

  const { data: cycles } = await supabase
    .from('review_cycles')
    .select('*')
    .eq('org_id', id)
    .order('created_at', { ascending: false });

  const statusColors: any = {
    active: { bg: '#052e16', color: '#4ade80' },
    draft: { bg: '#1a3a5c', color: '#93c5fd' },
    closed: { bg: '#1f0707', color: '#f87171' },
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href='/dashboard'
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            ← Workspaces
          </a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}
          >
            {org.name}
          </h1>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            background: 'var(--bg)',
            color: 'var(--text-secondary)',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            border: '1px solid var(--border)',
            textTransform: 'capitalize',
          }}
        >
          {membership.role}
        </span>
      </nav>

      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        {/* Review Cycles */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              Review cycles
            </h2>
            {['owner', 'admin', 'manager'].includes(membership.role) && (
              <a
                href={`/dashboard/org/${id}/cycles/new`}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                New cycle
              </a>
            )}
          </div>

          {cycles && cycles.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {cycles.map((cycle: any) => (
                <a
                  key={cycle.id}
                  href={`/dashboard/org/${id}/cycles/${cycle.id}`}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '1.125rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {cycle.title}
                    </p>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {cycle.due_date ? `Due ${cycle.due_date}` : 'No due date'}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      textTransform: 'capitalize',
                      background: statusColors[cycle.status]?.bg,
                      color: statusColors[cycle.status]?.color,
                    }}
                  >
                    {cycle.status}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '2.5rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
              >
                No review cycles yet.
              </p>
            </div>
          )}
        </section>

        {/* Team Members */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              Team members
            </h2>
            {['owner', 'admin'].includes(membership.role) && (
              <a
                href={`/dashboard/org/${id}/invite`}
                style={{
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                }}
              >
                Invite member
              </a>
            )}
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {members?.map((m: any, i: number) => (
              <div
                key={m.id}
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {m.profiles?.full_name || m.profiles?.email || 'Unknown'}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {m.profiles?.email}
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
                    textTransform: 'capitalize',
                  }}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
