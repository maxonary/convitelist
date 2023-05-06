import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'minecraft-protocol';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

const prisma = new PrismaClient();

export async function adminLogin(req: AuthenticatedRequest, res: Response) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username: req.body.username },
    });

    if (!admin) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Replace this with your preferred password hashing and verification library
    const passwordMatches = req.body.password === admin.password;

    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ adminId: admin.id }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function approveUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
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
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved: false },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

async function sendRconCommand(command: string) {
  const rconClient = createClient({
    host: minecraftHost,
    port: minecraftRconPort,
    password: minecraftRconPassword,
    type: 'rcon',
  });

  return new Promise<string>((resolve, reject) => {
    rconClient.on('auth', async () => {
      try {
        const response = await rconClient.send(command);
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        rconClient.end();
      }
    });

    rconClient.on('error', (error) => {
      reject(error);
    });
  });
}