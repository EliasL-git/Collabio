import { prisma } from "@/lib/prisma"

export async function isSetupComplete(): Promise<boolean> {
  try {
    // Check if we can connect to the database
    await prisma.$connect()
    
    // Check if admin user exists
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })
    
    await prisma.$disconnect()
    
    return adminCount > 0
  } catch {
    // If database connection fails, setup is not complete
    return false
  }
}
