import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Admin {
  username: string;
  password: string;
  email: string;
  invitationCode: string; // Add this
}

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body); // logging the request body

    const { username, password, email, invitationCode } = req.body as Admin;

    const existingInvitationCode = await prisma.invitationCode.findUnique({
      where: { code: invitationCode },
    });

    if (!existingInvitationCode) {
      return res.status(400).json({ message: 'Invalid invitation code' });
    }

    if (existingInvitationCode.used) {
      return res.status(400).json({ message: 'Invitation code already used' });
    }

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

    // Mark invitation code as used
    await prisma.invitationCode.update({
      where: { code: invitationCode },
      data: { used: true },
    });

    res.status(201).json(newAdminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};


export const getAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const adminUsers = await prisma.admin.findMany();

    res.status(200).json(adminUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting users' });
  }
};

export const getAdminUserById = async (req: Request, res: Response) => {
  try {
    const adminUserId = parseInt(req.params.adminUserId, 10);
    
    if (isNaN(adminUserId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    const adminUser = await prisma.admin.findUnique({ where: { id: adminUserId } });

    if (!adminUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(adminUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteAdminUserById = async (req: Request, res: Response) => {
  try {
    const adminUserId = parseInt(req.params.adminUserId, 10);
    
    if (isNaN(adminUserId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    const deletedAdminUser = await prisma.admin.delete({ where: { id: adminUserId } });

    res.status(200).json(deletedAdminUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateAdminUserById = async (req: Request, res: Response) => {
  try {
    const adminUserId = parseInt(req.params.adminUserId, 10);
    
    if (isNaN(adminUserId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    const { username, password, email } = req.body as Admin;

    const updatedAdminUser = await prisma.admin.update({
      where: { id: adminUserId },
      data: {
        username,
        password,
        email,
      },
    });

    res.status(200).json(updatedAdminUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
