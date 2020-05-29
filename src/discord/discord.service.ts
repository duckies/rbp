import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'discord.js';
import { EntityRepository } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import { PluginConfig } from './discord-config.class';
import { DiscordConfig } from './discord-plugin.entity';
import { CommandMeta, GroupMeta, InjectClient, LoopMeta, PluginOptions } from './discord.decorators';
import { DiscordPlugin } from './plugins/plugin.class';

export interface PluginMap {
  name: string;
  options: PluginOptions;
  instance: DiscordPlugin;
  commands: PluginCommandMap;
  groups: PluginGroupMap;
  loops: PluginLoopMap;
}

export interface GroupMapMeta extends GroupMeta {
  commands: PluginCommandMap;
}

export type PluginCommandMap = Map<string, CommandMeta>;
export type PluginGroupMap = Map<string, GroupMapMeta>;
export type PluginLoopMap = Map<string, LoopMeta>;

@Injectable()
export class DiscordService {
  public prefix: string;
  private _plugins = new Map<string, PluginMap>();

  constructor(
    @InjectRepository(DiscordConfig)
    private readonly pluginRepository: EntityRepository<DiscordConfig>,
    private readonly config: ConfigService,
    @InjectClient() public readonly client: Client,
  ) {
    this.prefix = '/';
  }

  get plugins() {
    return this._plugins;
  }

  // public allowedCommands(user: User | GuildMember) {
  //   return this.commandMetas.filter(
  //     (m) => typeof m.command.hasPermission !== 'function' || m.command.hasPermission(user),
  //   );
  // }

  /**
   * Builds a new PluginConfig class for managing settings for a plugin.
   * @param identifier
   */
  public getConfig<T, K = null>(identifier: string) {
    return new PluginConfig<T, K>(identifier, this.pluginRepository);
  }

  /**
   * Adds a plugin to the master list of plugins.
   * @param plugin
   * @param options
   * @param groups
   * @param commands
   * @param loops
   */
  public addPlugin(
    plugin: DiscordPlugin,
    options: PluginOptions,
    groups: GroupMeta[] = [],
    commands: CommandMeta[] = [],
    loops: LoopMeta[] = [],
  ) {
    const commandCollection: PluginCommandMap = new Map();
    const groupCollection: PluginGroupMap = new Map();
    const loopCollection: PluginLoopMap = new Map();

    loops.map((loop) => loopCollection.set(loop.name, { ...loop }));

    groups.map((group) => {
      groupCollection.set(group.name, { ...group, commands: new Map() });
    });

    commands.map((command) => {
      if (command.group) {
        const group = groupCollection.get(command.group);

        if (!group) throw new InternalServerErrorException(`Unknown plugin group ${command.group}`);

        group.commands.set(command.name, command);
      } else {
        commandCollection.set(command.name, command);
      }
    });

    this._plugins.set(options.name, {
      name: options.name,
      options,
      instance: plugin,
      groups: groupCollection,
      commands: commandCollection,
      loops: loopCollection,
    });
  }

  public getCommand(args: string[]) {
    for (const [name, plugin] of this._plugins) {
      const command = plugin.commands.get(args[0]);

      if (command) return { name, plugin, command, depth: 1 };

      const group = plugin.groups.get(args[0]);

      if (group) {
        // Send the help command for a command group.
        if (args.length === 1) return { name, plugin, group, depth: 1 };

        // Otherwise, try to find the command in the group.
        const command = group.commands.get(args[1]);

        if (command) return { name, plugin, command, depth: 2 };
      }
    }

    return undefined;
  }

  public getGuildMember(user_id: string) {
    return this.client.guilds.cache.get(this.config.get('DISCORD_GUILD_ID')).members.fetch(user_id);
  }

  public getGuildChannel(id: string) {
    return this.client.channels.cache.get(id);
  }
}
