'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface Permission {
  id: string
  userId: string
  appId: string
  canAccess: boolean
  canEdit: boolean
  canDelete: boolean
}

const apps = [
  { id: 'notes', name: 'Notes' },
  { id: 'markdown-studio', name: 'Markdown Studio' },
]

export default function PermissionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchData()
  }, [session])

  const fetchData = async () => {
    try {
      const [usersRes, permsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/permissions')
      ])
      const usersData = await usersRes.json()
      const permsData = await permsRes.json()
      setUsers(usersData)
      setPermissions(permsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = async (
    userId: string,
    appId: string,
    field: 'canAccess' | 'canEdit' | 'canDelete',
    value: boolean
  ) => {
    try {
      await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, appId, [field]: value })
      })
      await fetchData()
    } catch (error) {
      console.error('Failed to update permission:', error)
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      })
      await fetchData()
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const getUserPermission = (userId: string, appId: string) => {
    return permissions.find(p => p.userId === userId && p.appId === appId)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">User Permissions Management</h1>
        <p className="text-gray-600">Configure user roles and application access</p>
      </div>

      <div className="bg-white border border-[var(--border-color)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-[var(--border-color)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              {apps.map(app => (
                <th key={app.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {app.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{user.name || 'Unnamed'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border border-[var(--border-color)] rounded px-2 py-1 text-sm"
                    disabled={user.id === session?.user?.id}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                {apps.map(app => {
                  const perm = getUserPermission(user.id, app.id)
                  return (
                    <td key={app.id} className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={perm?.canAccess ?? false}
                            onChange={(e) => handlePermissionChange(user.id, app.id, 'canAccess', e.target.checked)}
                            className="rounded"
                          />
                          <span>Access</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={perm?.canEdit ?? false}
                            onChange={(e) => handlePermissionChange(user.id, app.id, 'canEdit', e.target.checked)}
                            disabled={!perm?.canAccess}
                            className="rounded"
                          />
                          <span>Edit</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={perm?.canDelete ?? false}
                            onChange={(e) => handlePermissionChange(user.id, app.id, 'canDelete', e.target.checked)}
                            disabled={!perm?.canAccess}
                            className="rounded"
                          />
                          <span>Delete</span>
                        </label>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
