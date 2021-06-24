import {
  HttpService,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import { RealmSlug } from '../../../blizzard/enums/realm.enum';
import { Region } from '../../../blizzard/enums/region.enum';
import {
  Fight,
  Report,
  Zone,
} from '../../../warcraftlogs/interfaces/reports.interface';
import { WarcraftLogsService } from '../../../warcraftlogs/warcraftlogs.service';
import { PluginConfig } from '../../discord-config.class';
import { Context } from '../../discord.context';
import { Command, CommandGroup, Plugin } from '../../discord.decorators';
import { DiscordService } from '../../discord.service';
import { DiscordPlugin } from '../plugin.class';
import { SettingsPlugin } from '../settings.plugin';
import { Instance } from './interfaces/instance.interface';

export interface WCLGuildConfig {
  watching: Record<string, string>;
  channel: string;
}

export interface WCLGlobalConfig {
  zones: Zone[];
}

@Injectable()
@Plugin('WarcraftLogs')
export class WarcraftLogsPlugin extends DiscordPlugin {
  private readonly logger = new Logger(WarcraftLogsPlugin.name);
  private readonly config: PluginConfig<WCLGuildConfig, WCLGlobalConfig>;

  private readonly guild = 'really bad players';
  private readonly realm = 'area-52';
  private readonly region = 'us';
  private hasActiveLog = false;

  constructor(
    private readonly discordService: DiscordService,
    private readonly http: HttpService,
    private readonly settings: SettingsPlugin,
    private readonly warcraftLogsService: WarcraftLogsService,
  ) {
    super();
    this.config = discordService.getConfig(WarcraftLogsPlugin.name);
    this.config.registerGlobal({ zones: [] });
    this.config.registerGuild({ watching: {}, channel: '' });
  }

  @CommandGroup({ name: 'wcl', description: 'WarcraftLogs related commands.' })
  wcl() {}

  @Command({
    name: 'channel',
    group: 'wcl',
    description: 'Sets the channel to send log announcements to.',
  })
  async setChannel(ctx: Context, cid: string) {
    const channel = ctx.message.guild.channels.cache.get(cid);

    if (!channel) {
      return ctx.send('Cannot find the given channel id.');
    } else if (
      !channel
        .permissionsFor(ctx.message.guild.me)
        .has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      return ctx.send('Cannot send messages or embeds to this channel.');
    }

    await this.config.setGuild(ctx.message.guild, { channel: cid });

    await ctx.tick();
  }

  @Command({
    name: 'debug',
    group: 'wcl',
    description: 'Display the current configuration.',
  })
  async getDebug(ctx: Context) {
    const config = await this.config.getGuild(ctx.guild);
    const globalConfig = await this.config.getGlobal();

    await ctx.send(ctx.formatCode(config, 'JSON'));
    await ctx.send(ctx.formatCode(globalConfig, 'JSON'));
  }

  @Command({
    name: 'log',
    group: 'wcl',
    description: 'Retrieves the embed for a log by its id.',
  })
  async log(ctx: Context, code: string) {
    try {
      const report = await this.warcraftLogsService.getReport(code);
      const instances = await this.getReportBreakdown(report);
      const embed = await this.getReportEmbed(report, instances);

      return ctx.send(embed);
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        return ctx.send(
          'Invalid or missing API key for WarcraftLogs, aborting!',
        );
      }

      this.logger.log(error);
      return ctx.send(`An unknown error occured, shwoops!`);
    }
  }

  @Command({
    name: 'logs',
    group: 'wcl',
    description: 'Retrieves the latest logs for the guild.',
  })
  async logs(ctx: Context) {
    try {
      const reports = await this.warcraftLogsService.getReports({
        name: 'Really Bad Players',
        realm: RealmSlug.Area52,
        region: Region.US,
      });

      const embeds: MessageEmbed[] = [];
      for (const report of reports) {
        const instances = await this.getReportBreakdown(report);
        const embed = await this.getReportEmbed(report, instances);

        embeds.push(embed);
      }

      await ctx.paginate(embeds);
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        return ctx.send(
          'Invalid or missing API key for WarcraftLogs, aborting!',
        );
      }

      this.logger.log(error);
      return ctx.send(`An unknown error occured, shwoops!`);
    }
  }

  private async getReportBreakdown(report: Report) {
    const instances: Instance[] = [];

    for (const fight of report.fights) {
      const zone = await this.getZone(fight);

      console.log(fight.name, zone.name);

      let instance = instances.find((i) => (i.zone.id = zone.id));

      if (!instance) {
        instance = {
          zone,
          difficulties: [],
        };

        instances.push(instance);
      }

      let difficulty = instance.difficulties.find(
        (d) => (d.id = fight.difficulty),
      );

      if (!difficulty) {
        difficulty = {
          id: fight.difficulty,
          name: zone.difficulties.find((d) => d.id === fight.difficulty).name,
          encounters: [],
        };

        instance.difficulties.push(difficulty);
      }

      let encounter = difficulty.encounters.find(
        (e) => e.encounterID === fight.encounterID,
      );

      if (!encounter) {
        encounter = {
          encounterID: fight.encounterID,
          name: fight.name,
          bestPercent: fight.bossPercentage,
          attempts: 1,
          kill: fight.kill ? fight.id : undefined,
        };

        difficulty.encounters.push(encounter);
      } else {
        if (fight.kill) {
          encounter.kill = fight.id;
          encounter.bestPercent = fight.bossPercentage;
        } else if (!encounter.kill) {
          encounter.bestPercent = fight.bossPercentage;
        }

        encounter.attempts++;
      }
    }

    return instances;
  }

  /**
   * Returns the zone from which an encounter took place.
   *
   * This method will cache the results in the database
   * to reduce the number of necessary WarcraftLogs queries.
   *
   * @param fight WarcraftLogs fight.
   */
  private async getZone(fight: Fight) {
    const { zones } = await this.config.getGlobal();

    let zone = zones.find((z) =>
      z.encounters.find((e) => e.id === fight.encounterID),
    );

    if (!zone) {
      zone = await this.warcraftLogsService.getZoneByEncounter(
        fight.encounterID,
      );

      await this.config.setGlobal({ zones: [...zones, zone] });
    }

    return zone;
  }

  // public async checkLogs() {
  //   // Loop through each guild and check for logs.
  //   for (const [, guild] of this.discordService.client.guilds.cache) {
  //     const { channel: id, watching } = await this.config.getGuild(guild);
  //     const nowWatching: Record<string, string> = {};

  //     // Guilds without an announcement channel aren't setup yet.
  //     if (!id) continue;

  //     const channel = guild.channels.cache.get(id);

  //     // Cannot locate the channel, abort. This is likely an error, e.g. deleted channel
  //     // and something should be done about this. Update the setting or check perms, perhaps.
  //     if (!channel) continue;

  //     const reports = (await this.getReports(key)).slice(0, 5);
  //     const [active, inactive] = partition(
  //       reports,
  //       (r) => moment(Date.now()).diff(r.end, 'hours') < 1,
  //     );
  //     this.hasActiveLog = active.length > 0;

  //     // Send final embed to watched reports that are now outdated, then remove them.
  //     for (const report of inactive) {
  //       if (watching.hasOwnProperty(report.id)) {
  //         const message = await (<TextChannel>channel).messages.fetch(
  //           watching[report.id],
  //         );

  //         // If the message is missing, e.g. deleted, don't bother doing any more.
  //         if (!message) continue;

  //         const embed = await this.getReportEmbed(report.id, false);
  //         await message.edit(embed);
  //       }
  //     }

  //     // Active reports could be new or continuing.
  //     for (const report of active) {
  //       const embed = await this.getReportEmbed(report.id, true);
  //       // Edit the existing message if possible.
  //       if (watching.hasOwnProperty(report.id)) {
  //         const message = await (<TextChannel>channel).messages.fetch(
  //           watching[report.id],
  //         );

  //         if (message) {
  //           await message.edit(embed);
  //           nowWatching[report.id] = message.id;
  //           // Intentionally skip this loop as we want to otherwise fall-through if
  //           // a message wasn't found, e.g. someone deleted it.
  //           continue;
  //         }
  //       }

  //       const message = await (<TextChannel>channel).send(embed);
  //       nowWatching[report.id] = message.id;
  //     }

  //     if (!isEqual(watching, nowWatching)) {
  //       await this.config.setGuild(guild, { watching: nowWatching });
  //     }
  //   }
  // }

  // @Loop('LogRetrieval')
  // public async loop() {
  //   while (true) {
  //     await this.checkLogs().catch((e) =>
  //       this.logger.error(e.message, e.stack),
  //     );

  //     // Scan every 5 minutes until we find a log, then every 1 while active.
  //     await sleep(this.hasActiveLog ? 60000 : 300000);
  //   }
  // }

  // private async getReportInfo(id: string): Promise<ReportInfo> {
  //   const { key } = await this.config.getGlobal();

  //   const url = `https://www.warcraftlogs.com/v1/report/fights/${id}?api_key=${key}`;
  //   const report = (await this.http.get(url).toPromise()).data as Report;
  //   const instances = {};

  //   for (const fight of report.fights) {
  //     // Ignore trash fights.
  //     if (fight.boss === 0) continue;

  //     const instance = await this.getBossInstanceName(fight.boss);
  //     const difficulty = this.difficulties[(<BossFight>fight).difficulty];

  //     // Add missing instances to the fights.
  //     if (!instances.hasOwnProperty(instance)) {
  //       instances[instance] = {};
  //     }

  //     // Add missing difficulties to the instance.
  //     if (!instances[instance].hasOwnProperty(difficulty)) {
  //       instances[instance][difficulty] = {};
  //     }

  //     // Add missing boss fights to the instances.
  //     if (!instances[instance][difficulty].hasOwnProperty(fight.name)) {
  //       instances[instance][difficulty][fight.name] = {
  //         ids: [],
  //         kill: false,
  //         killId: 0,
  //         percent: 10000,
  //         keystoneLevel: 0,
  //       };
  //     }

  //     instances[instance][difficulty][fight.name].ids.push(fight.id);

  //     if ((<BossFight>fight).kill) {
  //       instances[instance][difficulty][fight.name].kill = true;
  //       instances[instance][difficulty][fight.name].killId = fight.id;
  //     } else if (
  //       instances[instance][difficulty][fight.name].percent >
  //       (<BossFight>fight).bossPercentage
  //     ) {
  //       instances[instance][difficulty][fight.name].percent = (<BossFight>(
  //         fight
  //       )).bossPercentage;
  //     }

  //     if ((<Keystone>fight).keystoneLevel) {
  //       instances[instance][difficulty][fight.name].keystoneLevel = (<Keystone>(
  //         fight
  //       )).keystoneLevel;
  //     }
  //   }

  //   return { report, instances };
  // }

  // private async getZoneFromEncounter(id: number) {
  //   if (this.zones.has(id)) {
  //     return this.zones.get(id);
  //   }

  //   const zone = await this.warcraftLogsService.getZone();
  // }

  // private async getReportEmbed();

  /**
   * Obtains individual fight data from WarcraftLogs.
   */
  private async getReportEmbed(
    report: Report,
    instances: Instance[],
    watching?: boolean,
  ) {
    const embed = new MessageEmbed({
      title: 'Really Bad WarcraftLogs',
      description: `*${report.title} recorded by ${report.owner.name}*`,
      url: `https://www.warcraftlogs.com/reports/${report.code}`,
      color: await this.settings.getEmbedColor(),
      timestamp: new Date(report.endTime),
      thumbnail: { url: this.getRaidImage(report.zone.id) },
      footer: {
        text:
          typeof watching === 'undefined'
            ? undefined
            : watching
            ? 'Monitoring Log'
            : 'Monitoring Ended',
      },
    });

    for (const instance of instances) {
      for (const difficulty of instance.difficulties) {
        const bosses = [];

        for (const encounter of difficulty.encounters) {
          const link = `https://www.warcraftlogs.com/reports/${
            report.code
          }#fight=${encounter.kill || 'last'}`;

          if (difficulty.name === 'Mythic+') {
            bosses.push(`:key: [${encounter.name}](${link})`);
          } else if (encounter.kill) {
            bosses.push(
              `:skull: [${encounter.name}](${link}) ${
                encounter.attempts > 1
                  ? `killed in ${encounter.attempts} attempts`
                  : 'one-shot'
              }`,
            );
          } else {
            bosses.push(
              `:crossed_swords: [${encounter.name}](${link}) ${
                encounter.attempts > 1
                  ? `${encounter.attempts} attempts, best ${encounter.bestPercent}%`
                  : `first wipe at ${encounter.bestPercent}%`
              }`,
            );
          }
        }

        const fields = this.splitFieldText(bosses);

        for (let i = 0; i < fields.length; i++) {
          const pages =
            fields.length === 1 ? '' : ` (${i + 1}/${fields.length})`;

          embed.addField(
            `${difficulty.name === 'Mythic+ Dungeons' ? '' : difficulty.name} ${
              instance.zone.name
            }${pages}`,
            fields[i].join('\n'),
          );
        }
      }
    }

    if (report.fights.length) {
      embed.addField(
        'Log Analysis Tools :snake:',
        `[Wipefest](https://www.wipefest.net/report/${report.code}) [WoWAnalyzer](https://www.wowanalyzer.com/report/${report.code})`,
      );
    }

    return embed;
  }

  private splitFieldText(texts: string[]) {
    const fields: string[][] = [[]];
    let i = 0;

    for (let j = 0; j < texts.length; j++) {
      const curLength = fields[i].join('\n').length;
      const delimiterLength = texts.length - 1 === j ? 0 : 2;
      const textLength = texts[j].length;

      if (curLength + textLength + delimiterLength > 1024) {
        fields[++i] = [texts[j]];
      } else {
        fields[i].push(texts[j]);
      }
    }

    return fields;
  }

  private getRaidImage(id: number) {
    return `https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/zones/zone-${id}-small.jpg`;
  }
}
