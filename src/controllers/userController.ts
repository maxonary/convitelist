import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerUser(req: Request, res: Response) {
  try {
    const newUser = await prisma.user.create({
      data: {
        minecraftUsername: req.body.minecraftUsername,
        email: req.body.email,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
