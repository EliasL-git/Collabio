import { NextResponse } from "next/server"
import { execSync } from "child_process"

export async function POST() {
  try {
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', {
      encoding: 'utf-8',
      stdio: 'pipe'
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Migration failed'
    }, { status: 500 })
  }
}
