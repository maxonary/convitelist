import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
interface Admin {
  username: string;
  password: string;
  email: string;
}

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body); // logging the request body

    const { username, password, email } = req.body as Admin;

    const existingAdminUserByEmail = await prisma.admin.findUnique({
      where: { email },
    });

    const existingAdminUserByUsername = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdminUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (existingAdminUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdminUser = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    res.status(201).json(newAdminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};
