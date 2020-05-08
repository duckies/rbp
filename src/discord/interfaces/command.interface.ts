import { GuildMember, User } from 'discord.js';

export interface DiscordCog {
  /**
   * Optional message to be described in the help command.
   */
  getHelpMessage?: (prefix: string) => string;

  /**
   * Should return if the user has the ability to run the command.
   */
  hasPermission?: (user: User | GuildMember) => boolean;
}
