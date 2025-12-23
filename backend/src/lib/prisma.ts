import { PrismaClient } from '@prisma/client'
import path from 'path'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Log database URL on initialization
console.log('[Prisma] DATABASE_URL:', process.env.DATABASE_URL)
console.log('[Prisma] Working directory:', process.cwd())
console.log('[Prisma] Database path resolved:', path.resolve(process.env.DATABASE_URL?.replace('file:', '') || './data/prod.db'))

export default prisma
