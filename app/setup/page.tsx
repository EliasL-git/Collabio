'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CheckStatus {
  database: 'pending' | 'success' | 'error'
  migration: 'pending' | 'success' | 'error'
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'checking' | 'create-admin' | 'complete'>('checking')
  const [checks, setChecks] = useState<CheckStatus>({
    database: 'pending',
    migration: 'pending'
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    runChecks()
  }, [])

  const runChecks = async () => {
    try {
      // Check database connection
      const dbResponse = await fetch('/api/setup/check-database')
      const dbData = await dbResponse.json()
      
      if (dbData.connected) {
        setChecks(prev => ({ ...prev, database: 'success' }))
        
        // Run migrations
        const migrateResponse = await fetch('/api/setup/migrate', { method: 'POST' })
        const migrateData = await migrateResponse.json()
        
        if (migrateData.success) {
          setChecks(prev => ({ ...prev, migration: 'success' }))
          setStep('create-admin')
        } else {
          setChecks(prev => ({ ...prev, migration: 'error' }))
          setError('Migration failed. Please check your database configuration.')
        }
      } else {
        setChecks(prev => ({ ...prev, database: 'error' }))
        setError('Database connection failed. Please check your DATABASE_URL in .env')
      }
    } catch {
      setError('Setup check failed. Please ensure your environment is configured correctly.')
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/setup/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setStep('complete')
      } else {
        setError(data.error || 'Failed to create admin account')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sidebar-bg)]">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--office-blue)] mb-2">🚀 Collabio Setup</h1>
            <p className="text-gray-600">Let&apos;s get your workspace ready</p>
          </div>

          {step === 'checking' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Running System Checks</h2>
              
              <div className="flex items-center gap-3 p-4 border border-[var(--border-color)] rounded-md">
                <div className="flex-1">
                  <span className="font-medium">Database Connection</span>
                </div>
                <div>
                  {checks.database === 'pending' && <span className="text-gray-500">⏳ Checking...</span>}
                  {checks.database === 'success' && <span className="text-green-600">✅ Connected</span>}
                  {checks.database === 'error' && <span className="text-red-600">❌ Failed</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border border-[var(--border-color)] rounded-md">
                <div className="flex-1">
                  <span className="font-medium">Database Migration</span>
                </div>
                <div>
                  {checks.migration === 'pending' && <span className="text-gray-500">⏳ Waiting...</span>}
                  {checks.migration === 'success' && <span className="text-green-600">✅ Complete</span>}
                  {checks.migration === 'error' && <span className="text-red-600">❌ Failed</span>}
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </div>
          )}

          {step === 'create-admin' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Admin Account</h2>
              <p className="text-gray-600 mb-6">Set up your administrator account to manage Collabio</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--office-blue)]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--office-blue)]"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--office-blue)]"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--office-blue)]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Admin Account'}
                </button>
              </form>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold mb-2">Setup Complete!</h2>
              <p className="text-gray-600 mb-6">
                Your Collabio workspace is ready to use.
              </p>
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
