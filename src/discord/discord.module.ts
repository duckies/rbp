import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { BullModule } from '@nestjs/bull';
import {
  DynamicModule,
  HttpModule,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions, Message } from 'discord.js';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { FormSubmissionModule } from '../form-submission/form-submission.module';
import {
  DISCORD_CLIENT,
  DISCORD_PLUGIN,
  DISCORD_PLUGIN_COMMAND,
  DISCORD_PLUGIN_EVENT,
  DISCORD_PLUGIN_GROUP,
  DISCORD_PLUGIN_LOOP,
} from './../app.constants';
import { DiscordConfig } from './discord-plugin.entity';
import { Context } from './discord.context';
import { DiscordController } from './discord.controller';
import { EventMeta, InjectClient, PluginOptions } from './discord.decorators';
import { DiscordQueue } from './discord.queue';
import { DiscordService } from './discord.service';
import { AudioPlugin } from './plugins/audio.plugin';
import { HelpPlugin } from './plugins/help.plugin';
import { MemeBusterPlugin } from './plugins/meme-buster.plugin';
import { PingPlugin } from './plugins/ping.plugin';
import { DiscordPlugin } from './plugins/plugin.class';
import { ReactRolesPlugin } from './plugins/react-roles.plugin';
import { ReactionsPlugin } from './plugins/reactions.plugin';
import { SettingsPlugin } from './plugins/settings.plugin';
import { WarcraftLogsPlugin } from './plugins/warcraftlogs.plugin';
import { WelcomerPlugin } from './plugins/welcomer.plugin';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature({ entities: [DiscordConfig] }),
    DiscoveryModule,
    FormSubmissionModule,
    BullModule.registerQueue({ name: 'discord' }),
  ],
  providers: [
    DiscordQueue,
    HelpPlugin,
    PingPlugin,
    AudioPlugin,
    SettingsPlugin,
    WarcraftLogsPlugin,
    WelcomerPlugin,
    DiscordService,
    ReactRolesPlugin,
    ReactionsPlugin,
    MemeBusterPlugin,
  ],
  controllers: [DiscordController],
  exports: [DiscordService],
})
export class DiscordModule implements OnModuleInit {
  private readonly logger = new Logger(DiscordModule.name);

  static forRoot(options?: ClientOptions): DynamicModule {
    const client = new Client(options);
    const providers = [
      {
        provide: DISCORD_CLIENT,
        useValue: client,
      },
    ];

    return {
      module: DiscordModule,
      providers: providers,
      exports: providers,
    };
  }

  constructor(
    private readonly discover: DiscoveryService,
    private readonly discord: DiscordService,
    private readonly config: ConfigService,
    private readonly help: HelpPlugin,
    @InjectClient() private readonly client: Client,
  ) {}

  async onModuleInit() {
    await this.initializePlugins();
    await this.init();
  }

  async initializePlugins() {
    const plugins = await this.discover.providersWithMetaAtKey<PluginOptions>(
      DISCORD_PLUGIN,
    );

    for (const plugin of plugins) {
      const instance = plugin.discoveredClass.instance as DiscordPlugin;
      const groups = Reflect.getMetadata(DISCORD_PLUGIN_GROUP, instance);
      const commands = Reflect.getMetadata(DISCORD_PLUGIN_COMMAND, instance);
      const events: EventMeta[] = Reflect.getMetadata(
        DISCORD_PLUGIN_EVENT,
        instance,
      );
      const loops = Reflect.getMetadata(DISCORD_PLUGIN_LOOP, instance);

      if (events) {
        for (const { name, method } of events) {
          this.client.on(name as any, (...args: any[]) =>
            instance[method](this.client, ...args),
          );
        }
      }

      this.discord.addPlugin(instance, plugin.meta, groups, commands, loops);
    }
  }

  /**
   *
   * @param message
   */
  async messageHandler(message: Message) {
    // Don't invoke the main handler on partial messages.
    if (message.partial) return;

    // Ignore bots or messages without the prefix.
    if (
      message.author.bot ||
      !message.content.startsWith(this.discord.prefix)
    ) {
      return;
    }

    const args = this.splitArguments(message.content);
    const match = this.discord.getCommand(args);

    if (!match) return;

    // Remove the initial arguments pertaining to a command or group.
    args.splice(0, match.depth);

    const context = new Context(
      this.client,
      this.discord.prefix,
      message,
      this.discord.plugins,
    );

    const method = match.plugin.instance[
      match.group ? match.group.method : match.command.method
    ].bind(match.plugin.instance);

    // TODO: Add a means of skipping this for abstract groups.
    if (match.group) {
      await this.help.sendGroupHelp(context, match.group);
    }

    // TODO: If group, allow a means of not calling this method.
    method(context, ...this.coalesceArguments(args, method.length - 1));
  }

  /**
   * Forms the arguments for a command using the length of expected arguments.
   *
   * @param args
   * @param length
   */
  public coalesceArguments(args: string[], length: number) {
    const ret = [];

    for (let i = 0; i < Math.min(args.length, length); i++) {
      ret[i] = i === length - 1 ? args.slice(i).join(' ') : args[i];
    }

    return ret;
  }

  /**
   * Splits a string by spaces and items within quotes.
   * https://stackoverflow.com/a/46946490/8354855
   * @param args
   */
  public splitArguments(args: string): string[] {
    const cleanedArgs = args.slice(this.discord.prefix.length).trim();

    return cleanedArgs.length
      ? cleanedArgs.match(/\\?.|^$/g).reduce(
          (p: any, c) => {
            if (c === '"') {
              p.quote ^= 1;
            } else if (!p.quote && c === ' ') {
              p.a.push('');
            } else {
              p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
            }

            return p;
          },
          { a: [''] },
        ).a
      : [];
  }

  async init() {
    // Don't actually initialize the Discord bot during tests.
    if (this.config.get('NODE_ENV') === 'test') return;

    this.client.on('message', this.messageHandler.bind(this));
    this.client.login(this.config.get('DISCORD_BOT_TOKEN'));
    this.client.on('ready', async () => {
      this.logger.log(`Bot initialized`);

      // Run loops when the bot has finished loading.
      for (const [cname, plugin] of this.discord.plugins) {
        for (const [lname, loop] of plugin.loops) {
          this.logger.log(`Starting ${cname} loop: ${lname}`);
          await plugin.instance[loop.method].bind(plugin.instance)();
        }
      }
    });
  }
}
