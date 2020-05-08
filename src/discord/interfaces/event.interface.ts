import { Client } from 'discord.js';

export interface Event {
  execute: (client: Client, ...args) => Promise<void> | void;
}
