'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { submitFeedback } from './actions'

export default function FeedbackPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string
  const cycleId = params.cycleId as string
  const requestId = params.requestId as string

  const [response, setResponse] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')
    if (!response.trim()) { setError('Please write your feedback before submitting.'); setLoading(false); return }
    const result = await submitFeedback({ requestId, response: response.trim(), isAnonymous })
    if (result.error) { setError(result.error); setLoading(false); return }
    router.push(`/dashboard/org/${orgId}/cycles/${cycleId}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <a href={`/dashboard/org/${orgId}/cycles/${cycleId}`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to cycle</a>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Give feedback</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your feedback helps your teammate grow</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your feedback</label>
              <textarea
                value={response}
                onChange={e => setResponse(e.target.value)}
                rows={6}
                placeholder="Share what this person does well, where they can improve, and specific examples..."
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-hint)', marginTop: '0.4rem' }}>{response.length} characters</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} style={{ width: '16px', height: '16px' }} />
              <label htmlFor="anonymous" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Submit anonymously</label>
            </div>

            {error && <p style={{ fontSize: '0.875rem', color: 'var(--danger)', background: 'var(--danger-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Submitting...' : 'Submit feedback'}
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
