'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOrg } from './actions'

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

export default function CreateOrgPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    setError('')
    if (!name.trim()) { setError('Please enter a workspace name.'); setLoading(false); return }
    const result = await createOrg(name.trim())
    if (result.error) { setError(result.error); setLoading(false); return }
    router.push(`/dashboard/org/${result.orgId}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <a href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back</a>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Create a workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This will be your team's home in Loopback</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Workspace name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Acme Corp"
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
              {name && <p style={{ fontSize: '0.75rem', color: 'var(--text-hint)', marginTop: '0.4rem' }}>Slug: <span style={{ fontFamily: 'monospace' }}>{slugify(name)}</span></p>}
            </div>

            {error && <p style={{ fontSize: '0.875rem', color: 'var(--danger)', background: 'var(--danger-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{error}</p>}

            <button onClick={handleCreate} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Creating...' : 'Create workspace'}
            </button>
            <button onClick={() => router.push('/dashboard')} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
