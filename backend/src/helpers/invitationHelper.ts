import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const generateInvitationCode = async (): Promise<string> => {
  const code = crypto.randomBytes(16).toString('hex'); // generates a random string

  await prisma.invitationCode.create({
    data: {
      code,
      used: false,
    },
  });

  await prisma.$disconnect();

  return code;
};

export default generateInvitationCode;
