'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { inviteMember } from './actions'

export default function InviteMemberPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleInvite() {
    setLoading(true)
    setError('')
    setSuccess('')
    if (!email.trim()) { setError('Please enter an email address.'); setLoading(false); return }
    const result = await inviteMember({ orgId, email: email.trim(), role })
    if (result.error) { setError(result.error) } else { setSuccess(`${email} has been added to your workspace.`); setEmail('') }
    setLoading(false)
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
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Invite a member</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>They must already have a Loopback account</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInvite()} placeholder="teammate@company.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle }}>
                <option value="member">Member — can submit feedback</option>
                <option value="manager">Manager — can create review cycles</option>
                <option value="admin">Admin — can manage members</option>
              </select>
            </div>

            {error && <p style={{ fontSize: '0.875rem', color: 'var(--danger)', background: 'var(--danger-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{error}</p>}
            {success && <p style={{ fontSize: '0.875rem', color: 'var(--success)', background: 'var(--success-light)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>{success}</p>}

            <button onClick={handleInvite} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Adding...' : 'Add member'}
            </button>
            <button onClick={() => router.push(`/dashboard/org/${orgId}`)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
