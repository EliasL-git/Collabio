import { auth } from "@/lib/auth"

export default async function Dashboard() {
  const session = await auth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600">
          Access your workspace applications from the sidebar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-[var(--border-color)] rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Notes</h3>
          <p className="text-gray-600 text-sm">
            Create and manage your personal notes
          </p>
        </div>

        <div className="border border-[var(--border-color)] rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-xl font-semibold mb-2">Markdown Studio</h3>
          <p className="text-gray-600 text-sm">
            Write and preview markdown documents
          </p>
        </div>

        {session?.user?.role === 'ADMIN' && (
          <div className="border border-[var(--border-color)] rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
            <p className="text-gray-600 text-sm">
              Manage users and permissions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
