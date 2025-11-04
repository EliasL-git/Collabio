import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await prisma.$connect()
    await prisma.$disconnect()
    return NextResponse.json({ connected: true })
  } catch {
    return NextResponse.json({ connected: false }, { status: 500 })
  }
}
