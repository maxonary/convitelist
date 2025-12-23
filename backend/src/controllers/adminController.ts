import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

interface Admin {
  username: string;
  password: string;
  email: string;
  invitationCode?: string; // Optional for first admin
}

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body); // logging the request body

    const { username, password, email, invitationCode } = req.body as Admin;

    // Check if any admins exist
    const adminCount = await prisma.admin.count();
    const isFirstAdmin = adminCount === 0;

    // If not the first admin, require invitation code
    if (!isFirstAdmin) {
      if (!invitationCode) {
        return res.status(400).json({ message: 'Invitation code is required' });
      }

      const existingInvitationCode = await prisma.invitationCode.findUnique({
        where: { code: invitationCode },
      });

      if (!existingInvitationCode) {
        return res.status(400).json({ message: 'Invalid invitation code' });
      }

      if (existingInvitationCode.used) {
        return res.status(400).json({ message: 'Invitation code already used' });
      }
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
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

    // Mark invitation code as used (only required for non-first admins)
    if (!isFirstAdmin && invitationCode) {
      await prisma.invitationCode.update({
        where: { code: invitationCode },
        data: { used: true },
      });
    }

    res.status(201).json(newAdminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};


export const checkAdminExists = async (req: Request, res: Response) => {
  try {
    // Try raw SQL query first
    const rawCount = await prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) as count FROM Admin`;
    console.log(`[checkAdminExists] Raw SQL count: ${rawCount[0]?.count || 0}`);
    
    const adminCount = await prisma.admin.count();
    console.log(`[checkAdminExists] Prisma count: ${adminCount}`);
    
    const admins = await prisma.admin.findMany();
    console.log(`[checkAdminExists] Found ${admins.length} admins:`, admins.map(a => a.username));
    
    // Also try to get all tables
    const tables = await prisma.$queryRaw<Array<{ name: string }>>`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log(`[checkAdminExists] Tables in database:`, tables.map(t => t.name));
    
    res.status(200).json({ exists: adminCount > 0, isFirstAdmin: adminCount === 0 });
  } catch (error) {
    console.error('[checkAdminExists] Error:', error);
    res.status(500).json({ message: 'Error checking admin status' });
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
