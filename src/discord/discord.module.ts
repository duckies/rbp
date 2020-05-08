import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions, Message } from 'discord.js';
import { FormSubmissionModule } from '../form-submission/form-submission.module';
import {
  DISCORD_CLIENT,
  DISCORD_COG,
  DISCORD_COG_COMMAND,
  DISCORD_COG_GROUP,
  DISCORD_EVENT,
} from './../app.constants';
import { HelpCommand } from './commands/help.command';
import { PingCommand } from './commands/ping.command';
import { PlayCommand } from './commands/play.command';
import { SetCommand } from './commands/set.command';
import { DiscordController } from './discord.controller';
import { CogOptions, InjectClient } from './discord.decorators';
import { DiscordQueue } from './discord.queue';
import { DiscordService } from './discord.service';
import { GuildMemberAddEvent } from './events/guild-member-add.event';
import { MessageEvent } from './events/message.event';
import { DiscordCog } from './interfaces/command.interface';
import { Event } from './interfaces/event.interface';
import { DiscordEvent } from './interfaces/events.enum';
import { Context } from './discord.context';

@Module({
  imports: [DiscoveryModule, FormSubmissionModule, BullModule.registerQueue({ name: 'discord' })],
  providers: [
    DiscordQueue,
    HelpCommand,
    PingCommand,
    PlayCommand,
    SetCommand,
    MessageEvent,
    GuildMemberAddEvent,
    DiscordService,
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
    @InjectClient() private readonly client: Client,
  ) {}

  async onModuleInit() {
    await this.initializeCogs();
    await this.init();
  }

  async initializeEvents() {
    const Events = await this.discover.providersWithMetaAtKey<DiscordEvent>(DISCORD_EVENT);

    for (const event of Events) {
      const eventName = event.meta;
      const eventClass = event.discoveredClass.instance as Event;

      this.client.on(eventName as any, (...args: any[]) => eventClass.execute(this.client, ...args));
    }
  }

  async initializeCogs() {
    const Cogs = await this.discover.providersWithMetaAtKey<CogOptions>(DISCORD_COG);

    for (const cog of Cogs) {
      const instance = cog.discoveredClass.instance as DiscordCog;
      const groups = Reflect.getMetadata(DISCORD_COG_GROUP, instance);
      const commands = Reflect.getMetadata(DISCORD_COG_COMMAND, instance);

      this.discord.addCog(instance, cog.meta, groups, commands);
    }
  }

  /**
   *
   * @param message
   */
  async messageHandler(message: Message) {
    // Ignore bots or messages without the prefix.
    if (message.author.bot || !message.content.startsWith(this.discord.prefix)) {
      return;
    }

    const args = this.splitArguments(message.content);
    const match = this.discord.getCommand(args);

    if (!match) return;

    const context = new Context(this.client, this.discord.prefix, message);

    if (match.group) {
      const [, , ...rest] = args;
      const method = match.cog.instance[match.group.method].bind(match.cog.instance);

      method(context, ...this.coalesceArguments(rest, method.length - 1));
    } else if (match.command) {
      const [, ...rest] = args;
      const method = match.cog.instance[match.command.method].bind(match.cog.instance);

      method(context, ...this.coalesceArguments(rest, method.length - 1));
    }
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
      if (i === length - 1) {
        ret[i] = args.slice(i).join(' ');
      } else {
        ret[i] = args[i];
      }
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
    this.client.on('message', this.messageHandler.bind(this));
    this.client.login(this.config.get('DISCORD_BOT_TOKEN'));
    this.client.on('ready', () => this.logger.log(`Bot initialized`));
  }
}
