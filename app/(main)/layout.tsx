import { SessionProvider } from "next-auth/react"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 bg-white">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
