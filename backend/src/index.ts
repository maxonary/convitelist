import app from "./lib/createServer";
import dotenv from "dotenv";
import { syncWhitelistOnStartup } from "./helpers/whitelistSync";

dotenv.config();

const port = process.env.PORT || 3001;

// Set up unhandled rejection handler to catch RCON library errors
process.on('unhandledRejection', (reason) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  if (errorMessage.includes('Not connected')) {
    // Ignore "Not connected" errors from RCON library - these are expected when server is offline
    console.warn('[UnhandledRejection] Caught RCON "Not connected" error (server may be offline) - ignoring');
    return;
  }
  console.error('[UnhandledRejection] Unhandled promise rejection:', reason);
});

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  
  // Sync whitelist on startup (run asynchronously, don't block server startup)
  // Use setTimeout to ensure this runs after the server is fully started
  // Wrap in process.nextTick to ensure it runs in a separate tick and doesn't crash the server
  process.nextTick(() => {
    setTimeout(() => {
      // Wrap in additional try-catch to catch any synchronous errors
      try {
        syncWhitelistOnStartup().catch(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          // Ignore "Not connected" errors - these are expected when the server is offline
          if (errorMessage.includes('Not connected')) {
            console.warn('[Startup] Whitelist sync skipped (Minecraft server is offline), but backend is operational');
          } else {
            console.warn('[Startup] Whitelist sync failed (Minecraft server may not be running), but backend is operational');
            console.warn(`[Startup] Error: ${errorMessage}`);
          }
        });
      } catch (syncError) {
        const errorMessage = syncError instanceof Error ? syncError.message : String(syncError);
        // Ignore "Not connected" errors - these are expected when the server is offline
        if (errorMessage.includes('Not connected')) {
          console.warn('[Startup] Whitelist sync skipped (Minecraft server is offline), but backend is operational');
        } else {
          console.warn('[Startup] Whitelist sync initialization failed, but backend is operational');
          console.warn(`[Startup] Error: ${errorMessage}`);
        }
      }
    }, 2000); // Wait 2 seconds for server to fully initialize
  });
})