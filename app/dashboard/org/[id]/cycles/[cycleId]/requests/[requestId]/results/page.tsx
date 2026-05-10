import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export default async function FeedbackResultsPage({
  params,
}: {
  params: Promise<{ id: string; cycleId: string; requestId: string }>
}) {
  const { id: orgId, cycleId, requestId } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: request } = await admin
    .from('review_requests')
    .select('*, profiles(*)')
    .eq('id', requestId)
    .single()

  if (!request) redirect(`/dashboard/org/${orgId}/cycles/${cycleId}`)

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single()

  const isReviewee = request.reviewee_id === user.id
  const isManager = ['owner', 'admin', 'manager'].includes(membership?.role)

  if (!isReviewee && !isManager) redirect(`/dashboard/org/${orgId}`)

  const { data: feedbackList } = await admin
    .from('feedback')
    .select('*, profiles(*)')
    .eq('request_id', requestId)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem',
      }}>
        <a href={`/dashboard/org/${orgId}/cycles/${cycleId}`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Back to cycle
        </a>
      </nav>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Feedback for {request.profiles?.full_name || request.profiles?.email}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {feedbackList?.length || 0} response{feedbackList?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {feedbackList && feedbackList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbackList.map((f: any) => (
              <div key={f.id} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {f.is_anonymous ? 'Anonymous' : f.profiles?.full_name || f.profiles?.email || 'Unknown'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-hint)' }}>
                    {new Date(f.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {f.response}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No feedback submitted yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
