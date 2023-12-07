// src/tests/helpers/reset-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.invitationCode.deleteMany()
  ])
}