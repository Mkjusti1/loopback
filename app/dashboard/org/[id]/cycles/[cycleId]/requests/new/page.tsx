'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createReviewRequest } from './actions'

export default function NewReviewRequestPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string
  const cycleId = params.cycleId as string

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    setLoading(true)
    setError('')
    setSuccess('')
    if (!email.trim()) { setError('Please enter an email address.'); setLoading(false); return }
    const result = await createReviewRequest({ orgId, cycleId, email: email.trim() })
    if (result.error) { setError(result.error) } else { setSuccess(`${email} has been added for review.`); setEmail('') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <a href={`/dashboard/org/${orgId}/cycles/${cycleId}`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to cycle</a>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Add reviewee</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add a team member to be reviewed in this cycle</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="teammate@company.com"
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            {error && <p style={{ fontSize: '0.875rem', color: 'var(--danger)', background: 'var(--danger-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{error}</p>}
            {success && <p style={{ fontSize: '0.875rem', color: 'var(--success)', background: 'var(--success-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{success}</p>}

            <button onClick={handleAdd} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Adding...' : 'Add reviewee'}
            </button>
            <button onClick={() => router.push(`/dashboard/org/${orgId}/cycles/${cycleId}`)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
