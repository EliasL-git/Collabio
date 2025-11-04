import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const permissions = await prisma.permission.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error("Failed to fetch permissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, appId, canAccess, canEdit, canDelete } = await req.json()

    const permission = await prisma.permission.upsert({
      where: {
        userId_appId: {
          userId,
          appId
        }
      },
      update: {
        canAccess: canAccess ?? undefined,
        canEdit: canEdit ?? undefined,
        canDelete: canDelete ?? undefined,
      },
      create: {
        userId,
        appId,
        canAccess: canAccess ?? true,
        canEdit: canEdit ?? false,
        canDelete: canDelete ?? false,
      }
    })

    return NextResponse.json(permission)
  } catch (error) {
    console.error("Failed to update permission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
