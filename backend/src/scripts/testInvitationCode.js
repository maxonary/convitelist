// Generates a random invitation code and adds it to the database

const { PrismaClient } = require("@prisma/client");
const crypto = require('crypto');

const prisma = new PrismaClient();

const generateInvitationCode = async () => {
  const code = crypto.randomBytes(16).toString('hex'); // generates a random string

  await prisma.invitationCode.create({
    data: {
      code,
      used: false,
    },
  });

  await prisma.$disconnect();

  console.log(code);
};

generateInvitationCode();