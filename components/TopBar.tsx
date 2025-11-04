'use client'

import { usePathname } from "next/navigation"

export default function TopBar() {
  const pathname = usePathname()
  
  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname.includes('/notes')) return 'Notes'
    if (pathname.includes('/markdown-studio')) return 'Markdown Studio'
    if (pathname.includes('/admin')) return 'Admin Panel'
    return 'Collabio'
  }

  return (
    <header className="h-12 bg-white border-b border-[var(--border-color)] flex items-center px-6">
      <h2 className="text-lg font-semibold">{getTitle()}</h2>
    </header>
  )
}
