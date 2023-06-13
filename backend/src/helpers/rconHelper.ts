import Rcon from 'rcon';

const minecraftHost = process.env.MINECRAFT_HOST || '127.0.0.1';
const minecraftRconPort = parseInt(process.env.MINECRAFT_RCON_PORT || '25575', 10);
const minecraftRconPassword = process.env.MINECRAFT_RCON_PASSWORD || 'your-rcon-password';

export async function sendRconCommand(command: string) {
  const rconClient = new Rcon(minecraftHost, minecraftRconPort, minecraftRconPassword || '');

  return new Promise<string>((resolve, reject) => {
    rconClient.on('auth', async () => {
      try {
        const response = await rconClient.send(command);
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        rconClient.disconnect();
      }
    });

    rconClient.on('response', (response: string) => {
      resolve(response);
    });

    rconClient.on('error', (error: Error) => {
      reject(error);
    });

    try {
      rconClient.connect();
    } catch (error : any) {
      reject(error);
    }
  });
}