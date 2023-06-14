const { Rcon } = require('rcon-client');
require('dotenv').config();

const host = process.env.MINECRAFT_RCON_HOST;
const port = parseInt(process.env.MINECRAFT_RCON_PORT);
const password = process.env.MINECRAFT_RCON_PASSWORD;

const connectToServer = async () => {
  try {
    const rcon = await Rcon.connect({ host, port, password });
    console.log('Connected to Minecraft server via RCON');

    // Send RCON commands
    const response = await rcon.send('list');
    console.log('Server response:', response);

    // Close the RCON connection
    await rcon.end();
    console.log('Disconnected from Minecraft server');
  } catch (error) {
    console.error('Failed to connect to Minecraft server via RCON:', error);
  }
};

connectToServer();
