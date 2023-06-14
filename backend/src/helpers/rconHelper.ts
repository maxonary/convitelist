import { Rcon } from 'rcon-client';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.MINECRAFT_RCON_HOST;
const port = process.env.MINECRAFT_RCON_PORT ? parseInt(process.env.MINECRAFT_RCON_PORT) : undefined;
const password = process.env.MINECRAFT_RCON_PASSWORD;

if (!host || !port || !password) {
  throw new Error('Environment variables MINECRAFT_RCON_HOST, MINECRAFT_RCON_PORT, or MINECRAFT_RCON_PASSWORD are not set');
}

let rcon: Rcon | null = null;

export async function connectRcon() {
  if (!host || !port || !password) {
    throw new Error('RCON configuration not provided');
  }

  rcon = new Rcon({ host: host as string, port, password: password as string });

  try {
    await rcon.connect();
    console.log(`Connected to RCON server at ${host}:${port}`);
  } catch (error) {
    console.error(`Error connecting to RCON server at ${host}:${port}`, error);
    rcon = null;
  }
}

export async function sendRconCommand(command: string) {
  if (!rcon) {
    throw new Error('RCON is not connected');
  }

  try {
    const response = await rcon.send(command);
    console.log(`RCON command response: ${response}`);
    return response;
  } catch (error) {
    console.error(`Error sending RCON command: ${command}`, error);
    throw error;
  }
}

export function disconnectRcon() {
  if (rcon) {
    rcon.end();
    console.log('Disconnected from RCON server');
  }

  rcon = null;
}
