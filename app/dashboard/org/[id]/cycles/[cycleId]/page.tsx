import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export default async function CyclePage({
  params,
}: {
  params: Promise<{ id: string; cycleId: string }>
}) {
  const { id: orgId, cycleId } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single()

  if (!membership) redirect('/dashboard')

  const { data: cycle } = await supabase
    .from('review_cycles')
    .select('*')
    .eq('id', cycleId)
    .single()

  if (!cycle) redirect(`/dashboard/org/${orgId}`)

  const { data: requests } = await admin
    .from('review_requests')
    .select('*, profiles(*)')
    .eq('cycle_id', cycleId)

  const canManage = ['owner', 'admin', 'manager'].includes(membership.role)

  const statusColors: any = {
    active: { bg: '#052e16', color: '#4ade80' },
    draft: { bg: '#1a3a5c', color: '#93c5fd' },
    closed: { bg: '#1f0707', color: '#f87171' },
  }

  const requestStatusColors: any = {
    complete: { bg: '#052e16', color: '#4ade80' },
    in_progress: { bg: '#1a3a5c', color: '#93c5fd' },
    pending: { bg: '#1a2a1a', color: '#86efac' },
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href={`/dashboard/org/${orgId}`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← {cycle.title}
        </a>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '500',
          padding: '0.3rem 0.75rem',
          borderRadius: '999px',
          textTransform: 'capitalize',
          background: statusColors[cycle.status]?.bg,
          color: statusColors[cycle.status]?.color,
        }}>
          {cycle.status}
        </span>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {canManage && (
          <section style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Cycle status</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Activate the cycle to allow feedback submission
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {cycle.status === 'draft' && (
                <a href={`/dashboard/org/${orgId}/cycles/${cycleId}/activate`} style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}>
                  Activate
                </a>
              )}
              {cycle.status === 'active' && (
                <a href={`/dashboard/org/${orgId}/cycles/${cycleId}/close`} style={{
                  background: 'var(--danger)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}>
                  Close cycle
                </a>
              )}
            </div>
          </section>
        )}

        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>Who is being reviewed</h2>
            {canManage && (
              <a href={`/dashboard/org/${orgId}/cycles/${cycleId}/requests/new`} style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textDecoration: 'none',
              }}>
                Add reviewee
              </a>
            )}
          </div>

          {requests && requests.length > 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
              {requests.map((r: any, i: number) => (
                <div key={r.id} style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {r.profiles?.full_name || r.profiles?.email || 'Unknown'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.profiles?.email}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      textTransform: 'capitalize',
                      background: requestStatusColors[r.status]?.bg,
                      color: requestStatusColors[r.status]?.color,
                    }}>
                      {r.status}
                    </span>
                    {cycle.status === 'active' && (
                      <a href={`/dashboard/org/${orgId}/cycles/${cycleId}/requests/${r.id}/feedback`} style={{ fontSize: '0.75rem', color: 'var(--text-primary)', textDecoration: 'underline' }}>
                        Give feedback
                      </a>
                    )}
                    {canManage && (
                      <a href={`/dashboard/org/${orgId}/cycles/${cycleId}/requests/${r.id}/results`} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                        View results
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '2.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No one has been added for review yet.</p>
            </div>
          )}
        </section>

        {requests?.some((r: any) => r.reviewee_id === user.id) && (
          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>My review</h2>
            {requests
              .filter((r: any) => r.reviewee_id === user.id)
              .map((r: any) => (
                <div key={r.id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Your feedback results</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textTransform: 'capitalize' }}>{r.status}</p>
                  </div>
                  <a href={`/dashboard/org/${orgId}/cycles/${cycleId}/requests/${r.id}/results`} style={{
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}>
                    View my feedback
                  </a>
                </div>
              ))}
          </section>
        )}

      </main>
    </div>
  )
}
