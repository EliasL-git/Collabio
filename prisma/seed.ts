import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@collabio.local',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })

  console.log('✅ Created admin user:')
  console.log('   Email: admin@collabio.local')
  console.log('   Password: admin123')
  console.log('   ⚠️  Please change the password after first login!')

  // Create a sample regular user
  const userPassword = await bcrypt.hash('user123', 10)
  
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@collabio.local',
      password: userPassword,
      role: 'USER',
    }
  })

  console.log('✅ Created sample user:')
  console.log('   Email: user@collabio.local')
  console.log('   Password: user123')

  // Create sample permissions for the user
  await prisma.permission.createMany({
    data: [
      {
        userId: user.id,
        appId: 'notes',
        canAccess: true,
        canEdit: true,
        canDelete: true,
      },
      {
        userId: user.id,
        appId: 'markdown-studio',
        canAccess: true,
        canEdit: true,
        canDelete: false,
      }
    ]
  })

  console.log('✅ Created sample permissions')
  console.log('🌱 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
