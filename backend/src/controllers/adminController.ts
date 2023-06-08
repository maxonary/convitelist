import { Response } from 'express';
import { AuthenticatedRequest } from '../types/types';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'minecraft-protocol';
import jwt from 'jsonwebtoken';
import Rcon from 'rcon';

const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret';
const minecraftHost = process.env.MINECRAFT_HOST || '127.0.0.1';
const minecraftRconPort = parseInt(process.env.MINECRAFT_RCON_PORT || '25575', 10);
const minecraftRconPassword = process.env.MINECRAFT_RCON_PASSWORD || 'your-rcon-password';


const prisma = new PrismaClient();
interface User {
  minecraftUsername: string;
  approved: boolean;
}

export async function approveUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await sendRconCommand(`whitelist add ${user.minecraftUsername}`);

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

    await sendRconCommand(`whitelist remove ${user.minecraftUsername}`);

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
  const rconClient = new Rcon(minecraftHost, minecraftRconPort, minecraftRconPassword || '');

  return new Promise<string>((resolve, reject) => {
    rconClient.on('auth', async () => {
      try {
        const response = await rconClient.send(command);
        resolve(response);
      } catch (error : any) {
        reject(error);
      } finally {
        rconClient.disconnect();
      }
    });

    rconClient.on('error', (error: any) => {
      reject(error);
    });

    try {
      rconClient.connect();
    } catch (error : any) {
      reject(error);
    }
  });
}