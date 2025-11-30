import { Rcon } from 'rcon-client';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.MINECRAFT_RCON_HOST;
const port = process.env.MINECRAFT_RCON_PORT ? parseInt(process.env.MINECRAFT_RCON_PORT) : undefined;
const password = process.env.MINECRAFT_RCON_PASSWORD;
const RCON_TIMEOUT = 5000; // 5 seconds timeout
const MAX_RETRIES = 3;

if (!host || !port || !password) {
  throw new Error('Environment variables MINECRAFT_RCON_HOST, MINECRAFT_RCON_PORT, or MINECRAFT_RCON_PASSWORD are not set');
}

// Security: Warn if RCON host is not localhost
if (host !== '127.0.0.1' && host !== 'localhost') {
  console.warn(`[SECURITY WARNING] RCON host is set to ${host}. For security, RCON should only connect to localhost (127.0.0.1) when backend and Minecraft server are on the same system.`);
}

let rcon: Rcon | null = null;

/**
 * Validates that a command is safe to execute
 * Only allows specific whitelisted commands to prevent injection
 */
function validateCommand(command: string): boolean {
  // Only allow specific command patterns
  const allowedPatterns = [
    /^easywl\s+(add|remove|reload)\s+[\w.]+$/i, // easywl commands with usernames
  ];
  
  return allowedPatterns.some(pattern => pattern.test(command.trim()));
}

/**
 * Sanitizes username input to prevent command injection
 */
export function sanitizeUsername(username: string): string {
  // Remove any characters that could be used for command injection
  return username.replace(/[;&|`$(){}[\]<>]/g, '').trim();
}

/**
 * Connects to RCON server with timeout and retry logic
 */
export async function connectRcon(): Promise<void> {
  if (!host || !port || !password) {
    throw new Error('RCON configuration not provided');
  }

  // Clean up any existing connection
  if (rcon) {
    try {
      rcon.end();
    } catch (error) {
      // Ignore errors when cleaning up
    }
    rcon = null;
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      rcon = new Rcon({ 
        host: host as string, 
        port, 
        password: password as string
      });

      // Create a promise that rejects on timeout
      const connectPromise = rcon.connect();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('RCON connection timeout')), RCON_TIMEOUT);
      });

      await Promise.race([connectPromise, timeoutPromise]);
      
      console.log(`[RCON] Connected to server at ${host}:${port}`);
      return;
    } catch (error) {
      lastError = error as Error;
      console.error(`[RCON] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, error instanceof Error ? error.message : error);
      
      if (rcon) {
        try {
          rcon.end();
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
        rcon = null;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(`Failed to connect to RCON after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Sends a command to RCON server with validation and error handling
 */
export async function sendRconCommand(command: string): Promise<string> {
  if (!rcon) {
    // Try to reconnect if not connected
    await connectRcon();
  }

  if (!rcon) {
    throw new Error('RCON is not connected and reconnection failed');
  }

  // Validate command to prevent injection
  if (!validateCommand(command)) {
    console.error(`[RCON] Rejected potentially unsafe command: ${command}`);
    throw new Error('Invalid or unsafe RCON command');
  }

  try {
    const response = await rcon.send(command);
    // Log command execution (without sensitive data)
    console.log(`[RCON] Executed command: ${command.split(' ').slice(0, 2).join(' ')}...`);
    return response;
  } catch (error) {
    console.error(`[RCON] Error sending command: ${command}`, error instanceof Error ? error.message : error);
    
    // If connection error, mark as disconnected
    if (error instanceof Error && (error.message.includes('not connected') || error.message.includes('timeout'))) {
      rcon = null;
    }
    
    throw error;
  }
}

/**
 * Disconnects from RCON server
 */
export function disconnectRcon(): void {
  if (rcon) {
    try {
      rcon.end();
      console.log('[RCON] Disconnected from server');
    } catch (error) {
      console.error('[RCON] Error during disconnect:', error instanceof Error ? error.message : error);
    }
  }

  rcon = null;
}

/**
 * Checks if RCON is currently connected
 */
export function isRconConnected(): boolean {
  return rcon !== null;
}
