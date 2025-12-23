import { Request, Response } from 'express';

const SLEEPING_SERVER_URL = process.env.SLEEPING_SERVER_URL || 'http://localhost:5000';

/**
 * Get the status of the Minecraft server (via sleeping server)
 */
export const getServerStatus = async (req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${SLEEPING_SERVER_URL}/status`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[ServerStatus] Error fetching server status:', error instanceof Error ? error.message : error);
    res.status(503).json({ 
      status: 'Status service unavailable',
      error: 'Unable to connect to sleeping server' 
    });
  }
};

/**
 * Wake up the Minecraft server (via sleeping server)
 */
export const wakeUpServer = async (req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${SLEEPING_SERVER_URL}/wakeup`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text(); // wakeup endpoint returns plain text "received"
    res.status(200).json({ 
      message: 'Server wake-up command sent',
      response: data 
    });
  } catch (error) {
    console.error('[ServerStatus] Error waking up server:', error instanceof Error ? error.message : error);
    res.status(503).json({ 
      error: 'Unable to wake up server',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

