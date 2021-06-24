import * as Joi from '@hapi/joi';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@ntegral/nestjs-sentry';
import path from 'path';
import MikroOrmConfig from '../mikro-orm.config';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { BlizzardModule } from './blizzard/blizzard.module';
import { CharacterHistoryModule } from './character-history/character-history.module';
import { DiscordModule } from './discord/discord.module';
import { FormCharacterModule } from './form-character/form-character.module';
import { FormSubmissionModule } from './form-submission/form-submission.module';
import { FormModule } from './form/form.module';
import { CharacterModule } from './guild-character/character.module';
import { RaidModule } from './raid/raid.module';
import { RaiderIOModule } from './raiderIO/raiderIO.module';
import { SlideModule } from './slide/slide.module';
import { UserModule } from './user/user.module';
import {
  WCL_CLIENT_ID,
  WCL_CLIENT_SECRET,
  WCL_TOKEN_URL,
} from './warcraftlogs/warcraftlogs.constants';
import { WarcraftLogsModule } from './warcraftlogs/warcraftlogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../backend.env'),
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        SENTRY_DSN: Joi.string().required(),
        JWT_SECRET: Joi.string().default('testing'),
        BLIZZARD_CLIENTID: Joi.string().required(),
        BLIZZARD_SECRET: Joi.string().required(),
        BLIZZARD_CALLBACK: Joi.string().required(),
        MINIMUM_CHARACTER_LEVEL: Joi.number().default(10),
        CODECOV_TOKEN: Joi.string(),
        DISCORD_CLIENT_ID: Joi.string().required(),
        DISCORD_SECRET: Joi.string().required(),
        DISCORD_WEBHOOK: Joi.string().required(),
        DISCORD_CALLBACK: Joi.string().default(
          'http://localhost:3030/callback',
        ),
        TWITCH_CLIENT_ID: Joi.string().required(),
        TWITCH_SECRET_KEY: Joi.string().required(),
        BASE_URL: Joi.string().default('http://localhost:3030/'),
        [WCL_CLIENT_ID]: Joi.string().required(),
        [WCL_CLIENT_SECRET]: Joi.string().required(),
        [WCL_TOKEN_URL]: Joi.string().required(),
      }),
    }),
    WarcraftLogsModule,
    PassportModule.register({
      defaultStrategy: 'blizzard',
    }),
    MikroOrmModule.forRoot(MikroOrmConfig),
    DiscordModule.forRoot({
      partials: ['REACTION', 'CHANNEL', 'MESSAGE', 'USER', 'GUILD_MEMBER'],
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MEMBERS',
          'GUILD_MESSAGES',
          'GUILD_VOICE_STATES',
          'GUILD_MESSAGE_REACTIONS',
          'GUILD_PRESENCES',
        ],
      },
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        dsn: config.get('SENTRY_DSN'),
        debug: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    UserModule,
    AuthModule,
    SlideModule,
    ArticleModule,
    RaidModule,
    FormModule,
    FormCharacterModule,
    FormSubmissionModule,
    BlizzardModule,
    CharacterModule,
    CharacterHistoryModule,
    RaiderIOModule,
  ],
})
export class AppModule {}
