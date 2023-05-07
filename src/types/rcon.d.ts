declare module 'rcon' {
  import { EventEmitter } from 'events';

  class Rcon extends EventEmitter {
    constructor(host: string, port: number, password: string);
    connect(): Promise<void>;
    disconnect(): void;
    send(command: string): Promise<string>;
  }

  export default Rcon;
}
