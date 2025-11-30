import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/types';
import { connectRcon, disconnectRcon, sendRconCommand, sanitizeUsername } from '../helpers/rconHelper';
import { isValidUsername } from '../utils/isValidUsername';

const prisma = new PrismaClient();
interface User {
  minecraftUsername: string;
  gameType: string;
  approved: boolean;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { minecraftUsername, gameType } = req.body as User;

    const existingUser = await prisma.user.findFirst({
      where: { 
        minecraftUsername : minecraftUsername.toLowerCase(),
        gameType : gameType,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!isValidUsername(minecraftUsername, gameType)) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const newUser = await prisma.user.create({
      data: {
        minecraftUsername,
        gameType,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting users' });
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

// 

export async function approveUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Sanitize username to prevent command injection
    const sanitizedUsername = sanitizeUsername(user.minecraftUsername);
    
    if (!sanitizedUsername) {
      res.status(400).json({ error: 'Invalid username format' });
      return;
    }

    try {
      await connectRcon();

      if(user.gameType === 'Java Edition') {
        await sendRconCommand(`easywl add ${sanitizedUsername}`);
      } else if (user.gameType === 'Bedrock Edition') {
        await sendRconCommand(`easywl add .${sanitizedUsername}`);
      } else {
        throw new Error('Invalid game type');
      }

      await sendRconCommand(`easywl reload`);
    } finally {
      // Always disconnect, even if there was an error
      disconnectRcon();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function rejectUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Sanitize username to prevent command injection
    const sanitizedUsername = sanitizeUsername(user.minecraftUsername);
    
    if (!sanitizedUsername) {
      res.status(400).json({ error: 'Invalid username format' });
      return;
    }

    try {
      await connectRcon();

      if(user.gameType === 'Java Edition') {
        await sendRconCommand(`easywl remove ${sanitizedUsername}`);
      } else if (user.gameType === 'Bedrock Edition') {
        await sendRconCommand(`easywl remove .${sanitizedUsername}`);
      } else {
        throw new Error('Invalid game type');
      }
      
      await sendRconCommand(`easywl reload`);
    } finally {
      // Always disconnect, even if there was an error
      disconnectRcon();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved: false },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}