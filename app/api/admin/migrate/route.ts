import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { execSync } from "child_process"

export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Run Prisma migrations
    const output = execSync('npx prisma migrate deploy', {
      encoding: 'utf-8',
      stdio: 'pipe'
    })

    return NextResponse.json({ 
      success: true,
      message: 'Migrations completed successfully',
      output 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: "Migration failed. Please check server logs." },
      { status: 500 }
    )
  }
}
