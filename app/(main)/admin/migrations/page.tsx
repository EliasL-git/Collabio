'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function MigrationsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  if (session?.user?.role !== 'ADMIN') {
    router.push('/dashboard')
    return null
  }

  const handleRunMigrations = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: 'Database migrations completed successfully!'
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Migration failed'
        })
      }
    } catch {
      setResult({
        success: false,
        message: 'An error occurred while running migrations'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Database Migrations</h1>
        <p className="text-gray-600">
          Run database migrations after installing updates or new applications
        </p>
      </div>

      <div className="bg-white border border-[var(--border-color)] rounded-lg p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Migration Information</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              • Run migrations after updating Collabio to a new version
            </p>
            <p>
              • Run migrations after installing new applications
            </p>
            <p>
              • Migrations ensure your database schema is up to date
            </p>
          </div>
        </div>

        {result && (
          <div
            className={`mb-4 p-4 rounded-md ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {result.message}
          </div>
        )}

        <button
          onClick={handleRunMigrations}
          disabled={loading}
          className="px-6 py-2 bg-[var(--office-blue)] text-white rounded-md hover:bg-[var(--office-blue-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Running Migrations...' : 'Run Database Migrations'}
        </button>
      </div>
    </div>
  )
}
