#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { createInterface } from 'readline'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise(resolve => readline.question(query, resolve))
}

const runCommand = (command: string, silent = false): string => {
  try {
    return execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    })
  } catch (error) {
    if (!silent) throw error
    return ''
  }
}

const checkmark = '✅'
const crossmark = '❌'
const arrow = '➜'

console.log('\n🚀 Collabio Setup Wizard\n')

async function checkDatabase(): Promise<boolean> {
  process.stdout.write('Checking database configuration... ')
  
  if (!existsSync('.env')) {
    console.log(`${crossmark}`)
    console.log(`\n${arrow} .env file not found. Creating from template...`)
    
    if (existsSync('.env.example')) {
      const envExample = readFileSync('.env.example', 'utf-8')
      writeFileSync('.env', envExample)
      console.log(`${checkmark} .env file created`)
      console.log(`\n${arrow} Please edit .env and set your DATABASE_URL and NEXTAUTH_SECRET`)
      console.log(`   DATABASE_URL example: ******postgres:5432/collabio`)
      console.log(`   Generate NEXTAUTH_SECRET with: openssl rand -base64 32\n`)
      return false
    } else {
      console.log(`${crossmark} .env.example not found`)
      return false
    }
  }
  
  const envContent = readFileSync('.env', 'utf-8')
  const hasDbUrl = envContent.includes('DATABASE_URL=') && 
                   !envContent.includes('DATABASE_URL=""') &&
                   !envContent.includes('DATABASE_URL=******')
  const hasAuthSecret = envContent.includes('NEXTAUTH_SECRET=') &&
                        !envContent.includes('NEXTAUTH_SECRET=""') &&
                        !envContent.includes('NEXTAUTH_SECRET="your-secret-key')
  
  if (!hasDbUrl || !hasAuthSecret) {
    console.log(`${crossmark}`)
    if (!hasDbUrl) console.log(`   ${arrow} DATABASE_URL not configured in .env`)
    if (!hasAuthSecret) console.log(`   ${arrow} NEXTAUTH_SECRET not configured in .env`)
    return false
  }
  
  console.log(`${checkmark}`)
  return true
}

async function testDatabaseConnection(): Promise<boolean> {
  process.stdout.write('Testing database connection... ')
  
  try {
    const prisma = new PrismaClient()
    await prisma.$connect()
    await prisma.$disconnect()
    console.log(`${checkmark}`)
    return true
  } catch {
    console.log(`${crossmark}`)
    console.log(`   ${arrow} Could not connect to database`)
    console.log(`   ${arrow} Please check your DATABASE_URL in .env`)
    return false
  }
}

async function generatePrismaClient() {
  process.stdout.write('Generating Prisma Client... ')
  try {
    runCommand('npx prisma generate', true)
    console.log(`${checkmark}`)
  } catch (error) {
    console.log(`${crossmark}`)
    throw error
  }
}

async function runMigrations() {
  process.stdout.write('Running database migrations... ')
  try {
    runCommand('npx prisma migrate deploy', true)
    console.log(`${checkmark}`)
  } catch (error) {
    console.log(`${crossmark}`)
    throw error
  }
}

async function checkExistingAdmin(): Promise<boolean> {
  const prisma = new PrismaClient()
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })
    await prisma.$disconnect()
    return adminCount > 0
  } catch {
    await prisma.$disconnect()
    return false
  }
}

async function createAdminAccount() {
  console.log(`\n${arrow} Let's create your admin account\n`)
  
  const name = await question('Admin name: ')
  const email = await question('Admin email: ')
  
  let password = ''
  let confirmPassword = ''
  
  do {
    password = await question('Admin password (min 6 characters): ')
    if (password.length < 6) {
      console.log(`${crossmark} Password must be at least 6 characters`)
      continue
    }
    confirmPassword = await question('Confirm password: ')
    if (password !== confirmPassword) {
      console.log(`${crossmark} Passwords do not match. Please try again.`)
    }
  } while (password !== confirmPassword || password.length < 6)
  
  process.stdout.write('\nCreating admin account... ')
  
  const prisma = new PrismaClient()
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    await prisma.$disconnect()
    console.log(`${checkmark}`)
    console.log(`\n${checkmark} Admin account created successfully!`)
    console.log(`   Email: ${email}`)
    
  } catch (error) {
    await prisma.$disconnect()
    console.log(`${crossmark}`)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      console.log(`   ${arrow} Email already exists. Please use a different email.`)
    } else if (error && typeof error === 'object' && 'message' in error) {
      console.log(`   ${arrow} Error: ${String(error.message)}`)
    } else {
      console.log(`   ${arrow} An unknown error occurred`)
    }
    throw error
  }
}

async function main() {
  try {
    // Step 1: Check database configuration
    const dbConfigured = await checkDatabase()
    if (!dbConfigured) {
      console.log(`\n${crossmark} Setup incomplete. Please configure your .env file and run setup again.\n`)
      process.exit(1)
    }
    
    // Step 2: Generate Prisma Client
    await generatePrismaClient()
    
    // Step 3: Test database connection
    const dbConnected = await testDatabaseConnection()
    if (!dbConnected) {
      console.log(`\n${crossmark} Setup incomplete. Please fix database connection and run setup again.\n`)
      process.exit(1)
    }
    
    // Step 4: Run migrations
    await runMigrations()
    
    // Step 5: Check for existing admin
    const hasAdmin = await checkExistingAdmin()
    
    if (hasAdmin) {
      console.log(`\n${checkmark} Admin account already exists`)
      
      const createAnother = await question(`\n${arrow} Create another admin account? (y/N): `)
      if (createAnother.toLowerCase() === 'y' || createAnother.toLowerCase() === 'yes') {
        await createAdminAccount()
      }
    } else {
      await createAdminAccount()
    }
    
    console.log(`\n${checkmark} Setup complete!\n`)
    console.log(`${arrow} Start the development server: npm run dev`)
    console.log(`${arrow} Visit: http://localhost:3000\n`)
    
  } catch {
    console.log(`\n${crossmark} Setup failed. Please check the errors above.\n`)
    process.exit(1)
  } finally {
    readline.close()
  }
}

main()
