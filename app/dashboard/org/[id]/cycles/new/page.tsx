'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createCycle } from './actions'

export default function NewCyclePage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    setError('')
    if (!title.trim()) { setError('Please enter a cycle title.'); setLoading(false); return }
    const result = await createCycle({ orgId, title: title.trim(), dueDate: dueDate || null })
    if (result.error) { setError(result.error); setLoading(false); return }
    router.push(`/dashboard/org/${orgId}`)
  }

  const inputStyle = { width: '100%', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.5rem' } as any

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <a href={`/dashboard/org/${orgId}`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back</a>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>New review cycle</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>A cycle is a single round of performance reviews</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Cycle title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="Q1 2026 Performance Review" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Due date <span style={{ color: 'var(--text-hint)', fontWeight: '400' }}>(optional)</span></label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: '0.875rem', color: 'var(--danger)', background: 'var(--danger-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{error}</p>}

            <button onClick={handleCreate} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Creating...' : 'Create cycle'}
            </button>
            <button onClick={() => router.push(`/dashboard/org/${orgId}`)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
