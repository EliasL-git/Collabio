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

  // Get credentials from environment or use defaults for development
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@collabio.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const userEmail = process.env.USER_EMAIL || 'user@collabio.local'
  const userPassword = process.env.USER_PASSWORD || 'user123'

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10)
  
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: adminEmail,
      password: hashedAdminPassword,
      role: 'ADMIN',
    }
  })

  console.log('✅ Created admin user:')
  console.log(`   Email: ${adminEmail}`)
  if (!process.env.ADMIN_PASSWORD) {
    console.log('   Password: admin123')
    console.log('   ⚠️  Using default password! Please change it after first login!')
  } else {
    console.log('   Password: <set from environment>')
  }

  // Create a sample regular user
  const hashedUserPassword = await bcrypt.hash(userPassword, 10)
  
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: userEmail,
      password: hashedUserPassword,
      role: 'USER',
    }
  })

  console.log('✅ Created sample user:')
  console.log(`   Email: ${userEmail}`)
  if (!process.env.USER_PASSWORD) {
    console.log('   Password: user123')
  } else {
    console.log('   Password: <set from environment>')
  }

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
