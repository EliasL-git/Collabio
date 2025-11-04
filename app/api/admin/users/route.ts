import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, role } = await req.json()

    // Prevent self-demotion
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
