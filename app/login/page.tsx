'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: '' } }
      })
      if (error) setError(error.message)
      else setError('Check your email to confirm your account.')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'var(--accent)',
            borderRadius: '14px',
            marginBottom: '1rem'
          }}>
            <span style={{ color: 'white', fontSize: '22px' }}>↺</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Loopback
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {error && (
              <p style={{
                fontSize: '0.8125rem',
                color: error.includes('Check') ? 'var(--success)' : 'var(--danger)',
                background: error.includes('Check') ? 'var(--success-light)' : 'var(--danger-light)',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px'
              }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--text-hint)' : 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s'
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

          </div>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          marginTop: '1.25rem'
        }}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.8125rem'
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  )
}
