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

/**
 * Put the Minecraft server to sleep (stop it and return to sleep mode)
 * This calls the wakeup endpoint which toggles - if server is running, it stops it
 */
export const sleepServer = async (req: Request, res: Response) => {
  try {
    // First check the current status
    const statusController = new AbortController();
    const statusTimeoutId = setTimeout(() => statusController.abort(), 5000);
    
    let currentStatus = 'Unknown';
    try {
      const statusResponse = await fetch(`${SLEEPING_SERVER_URL}/status`, {
        method: 'GET',
        signal: statusController.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(statusTimeoutId);
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        currentStatus = statusData.status || 'Unknown';
      }
    } catch (statusError) {
      clearTimeout(statusTimeoutId);
      console.warn('[ServerStatus] Could not fetch current status, proceeding anyway');
    }
    
    // If server is not running, return early
    if (currentStatus !== 'Running') {
      return res.status(200).json({ 
        message: `Server is already ${currentStatus}. No action needed.`,
        status: currentStatus
      });
    }
    
    // Server is running, call wakeup to stop it (wakeup toggles - stops if running)
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
    
    const data = await response.text();
    res.status(200).json({ 
      message: 'Server sleep command sent successfully',
      response: data,
      previousStatus: currentStatus
    });
  } catch (error) {
    console.error('[ServerStatus] Error putting server to sleep:', error instanceof Error ? error.message : error);
    res.status(503).json({ 
      error: 'Unable to put server to sleep',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

