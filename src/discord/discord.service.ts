import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'discord.js';
import { CogOptions, Command, Group, GroupOptions, InjectClient } from './discord.decorators';
import { DiscordCog } from './interfaces/command.interface';

export interface CogMap {
  name: string;
  options: CogOptions;
  instance: DiscordCog;
  groups: CogGroups;
  commands: CogCommands;
}

export type CogGroups = Map<string, Omit<Group, 'name'>>;

export interface CommandGroup extends GroupOptions {
  commands: CogCommands;
}

export type CogCommands = Map<string, Command>;

@Injectable()
export class DiscordService {
  public prefix: string;
  private _cogs = new Map<string, CogMap>();

  constructor(private readonly config: ConfigService, @InjectClient() private readonly client: Client) {
    this.prefix = '?';
  }

  get cogs() {
    return this._cogs;
  }

  // public allowedCommands(user: User | GuildMember) {
  //   return this.commandMetas.filter(
  //     (m) => typeof m.command.hasPermission !== 'function' || m.command.hasPermission(user),
  //   );
  // }

  public addCog(cog: DiscordCog, options: CogOptions, groups: Group[] = [], commands: Command[] = []) {
    const commandCollection: CogCommands = new Map();
    const groupCollection: CogGroups = new Map();

    groups.map(({ name, ...opts }) => {
      groupCollection.set(name, { ...opts, commands: new Map() });
    });

    commands.map((command) => {
      if (command.group) {
        const group = groupCollection.get(command.group);

        if (!group) throw new InternalServerErrorException(`Unknown cog group ${command.group}`);

        group.commands.set(command.name, command);
      } else {
        commandCollection.set(command.name, command);
      }
    });

    this._cogs.set(options.name, {
      name: options.name,
      options,
      instance: cog,
      groups: groupCollection,
      commands: commandCollection,
    });
  }

  public getCommand(args: string[]) {
    for (const [name, cog] of this._cogs) {
      const command = cog.commands.get(args[0]);

      if (command) return { name, cog, command };

      const group = cog.groups.get(args[0]);

      if (group) {
        // Send the help command for a command group.
        if (args.length === 1) return { name, cog, group };

        // Otherwise, try to find the command in the group.
        const command = group.commands.get(args[1]);

        if (command) return { name, cog, command };
      }
    }

    return undefined;
  }

  // public getSubCommand(parentKey: string, key: string) {
  //   const parent = this.commandMetas.get(parentKey.toLowerCase());

  //   return parent.subCommands.find((s) => s.name === key.toLowerCase());
  // }

  public getGuildMember(user_id: string) {
    // return this.client.guilds.cache.get(this.config.get('DISCORD_GUILD_ID')).members.fetch(user_id);
    return this.client.guilds.cache.get('443958062542356481').members.fetch(user_id);
  }
}
