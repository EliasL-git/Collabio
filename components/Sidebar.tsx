'use client'

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Sidebar() {
  const { data: session } = useSession()
  
  const apps = [
    { id: 'notes', name: 'Notes', icon: '📝', href: '/apps/notes' },
    { id: 'markdown-studio', name: 'Markdown Studio', icon: '✍️', href: '/apps/markdown-studio' },
  ]

  return (
    <aside className="w-64 h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <h1 className="text-2xl font-semibold text-[var(--office-blue)]">Collabio</h1>
        <p className="text-xs text-gray-600">Workspace Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white transition-colors"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>

        <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Applications
          </h3>
          {apps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white transition-colors mb-1"
            >
              <span className="text-xl">{app.icon}</span>
              <span>{app.name}</span>
            </Link>
          ))}
        </div>

        {session?.user?.role === 'ADMIN' && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Admin
            </h3>
            <Link
              href="/admin/permissions"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white transition-colors"
            >
              <span className="text-xl">⚙️</span>
              <span>Permissions</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[var(--office-blue)] flex items-center justify-center text-white font-semibold">
            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-gray-600 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full px-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded-md hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
