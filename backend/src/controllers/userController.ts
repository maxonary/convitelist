import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/types';
import { connectRcon, disconnectRcon, sendRconCommand } from '../helpers/rconHelper';

const prisma = new PrismaClient();
interface User {
  minecraftUsername: string;
  approved: boolean;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { minecraftUsername } = req.body as User;

    const existingUser = await prisma.user.findUnique({
      where: { minecraftUsername },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await prisma.user.create({
      data: {
        minecraftUsername,
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

    await connectRcon();
    await sendRconCommand(`whitelist add ${user.minecraftUsername}`);
    await sendRconCommand(`whitelist reload`);
    await disconnectRcon();

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
    await connectRcon();
    await sendRconCommand(`whitelist remove ${user.minecraftUsername}`);
    await sendRconCommand(`whitelist reload`);
    await disconnectRcon();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved: false },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}