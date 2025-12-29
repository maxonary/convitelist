import prisma from '../lib/prisma';
import { connectRcon, sendRconCommand, disconnectRcon, sanitizeUsername } from './rconHelper';

/**
 * Syncs all approved users from the database to the Minecraft server whitelist
 * This ensures the whitelist is in sync with the database on startup
 */
export async function syncWhitelistOnStartup(): Promise<void> {
  try {
    console.log('[WhitelistSync] Starting whitelist synchronization...');
    
    // Get all approved users from the database
    const approvedUsers = await prisma.user.findMany({
      where: { approved: true },
    });

    if (approvedUsers.length === 0) {
      console.log('[WhitelistSync] No approved users found in database');
      return;
    }

    console.log(`[WhitelistSync] Found ${approvedUsers.length} approved users to sync`);

    // Connect to RCON - wrap in try-catch to handle any errors
    // Don't try to disconnect if connection failed - it will cause "Not connected" errors
    try {
      await connectRcon();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Ignore "Not connected" errors - these are expected when the server is offline
      if (errorMessage.includes('Not connected')) {
        console.warn('[WhitelistSync] RCON connection failed (Minecraft server may not be running), skipping whitelist sync');
      } else {
        console.warn('[WhitelistSync] Failed to connect to RCON (Minecraft server may not be running), skipping whitelist sync');
        console.warn(`[WhitelistSync] Error: ${errorMessage}`);
      }
      console.warn('[WhitelistSync] Whitelist will be synced when Minecraft server is available');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Add each approved user to the whitelist
    for (const user of approvedUsers) {
      try {
        const sanitizedUsername = sanitizeUsername(user.minecraftUsername);
        
        if (!sanitizedUsername) {
          console.warn(`[WhitelistSync] Skipping user ${user.minecraftUsername} (ID: ${user.id}) - invalid username format`);
          errorCount++;
          continue;
        }

        // Add user to whitelist based on game type
        // EasyWhitelist will handle duplicates gracefully (users already on whitelist will be skipped)
        try {
          if (user.gameType === 'Java Edition') {
            await sendRconCommand(`easywl add ${sanitizedUsername}`);
            console.log(`[WhitelistSync] Added Java user: ${sanitizedUsername}`);
          } else if (user.gameType === 'Bedrock Edition') {
            // Add dot prefix for Bedrock players (Floodgate requirement)
            await sendRconCommand(`easywl add .${sanitizedUsername}`);
            console.log(`[WhitelistSync] Added Bedrock user: .${sanitizedUsername}`);
          } else {
            console.warn(`[WhitelistSync] Skipping user ${user.minecraftUsername} (ID: ${user.id}) - unknown game type: ${user.gameType}`);
            errorCount++;
            continue;
          }
          successCount++;
        } catch (rconError) {
          // If RCON connection is lost, try to reconnect once
          const errorMessage = rconError instanceof Error ? rconError.message : String(rconError);
          if (errorMessage.includes('Not connected') || errorMessage.includes('ECONNREFUSED')) {
            console.warn(`[WhitelistSync] RCON connection lost, attempting to reconnect...`);
            try {
              await connectRcon();
              // Retry the command
                  if (user.gameType === 'Java Edition') {
                    await sendRconCommand(`easywl add ${sanitizedUsername}`);
                    console.log(`[WhitelistSync] Added Java user: ${sanitizedUsername} (after reconnect)`);
                  } else if (user.gameType === 'Bedrock Edition') {
                    // Add dot prefix for Bedrock players (Floodgate requirement)
                    await sendRconCommand(`easywl add .${sanitizedUsername}`);
                    console.log(`[WhitelistSync] Added Bedrock user: .${sanitizedUsername} (after reconnect)`);
              }
              successCount++;
            } catch (retryError) {
              console.error(`[WhitelistSync] Failed to reconnect or add user ${user.minecraftUsername} (ID: ${user.id}):`, retryError instanceof Error ? retryError.message : retryError);
              errorCount++;
              // If we can't reconnect, break out of the loop
              throw new Error('RCON connection lost and reconnection failed');
            }
          } else {
            // Other errors (like user already on whitelist) - log but continue
            console.warn(`[WhitelistSync] Could not add user ${user.minecraftUsername} (ID: ${user.id}) - may already be on whitelist: ${errorMessage}`);
            // Don't count as error if it's likely a duplicate
            if (!errorMessage.toLowerCase().includes('already') && !errorMessage.toLowerCase().includes('duplicate')) {
              errorCount++;
            } else {
              successCount++; // Count as success if user is already on whitelist
            }
          }
        }
      } catch (error) {
        console.error(`[WhitelistSync] Fatal error processing user ${user.minecraftUsername} (ID: ${user.id}):`, error instanceof Error ? error.message : error);
        errorCount++;
        // If connection is completely lost, stop trying
        if (error instanceof Error && error.message.includes('RCON connection lost')) {
          break;
        }
      }
    }

    // Reload the whitelist to ensure all changes are applied
    try {
      await sendRconCommand('easywl reload');
      console.log('[WhitelistSync] Whitelist reloaded');
    } catch (error) {
      console.error('[WhitelistSync] Error reloading whitelist:', error instanceof Error ? error.message : error);
    }

    // Disconnect from RCON
    disconnectRcon();

    console.log(`[WhitelistSync] Synchronization complete: ${successCount} users added, ${errorCount} errors`);
  } catch (error) {
    console.error('[WhitelistSync] Fatal error during whitelist synchronization:', error instanceof Error ? error.message : error);
    // Make sure to disconnect even on fatal error
    disconnectRcon();
  }
}

