import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AccessControlModule } from 'nest-access-control';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import MikroOrmConfig from '../mikro-orm.config';
import { roleBuilder } from './app.roles';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { BlizzardModule } from './blizzard/blizzard.module';
import { DiscordModule } from './discord/discord.module';
import { FormCharacterModule } from './form-character/form-character.module';
import { FormSubmissionModule } from './form-submission/form-submission.module';
import { FormModule } from './form/form.module';
import { CharacterModule } from './guild-character/character.module';
import { RaidModule } from './raid/raid.module';
import { RaiderIOModule } from './raiderIO/raiderIO.module';
import { SlideModule } from './slide/slide.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().default('testing'),
        BLIZZARD_CLIENTID: Joi.string().required(),
        BLIZZARD_SECRET: Joi.string().required(),
        BLIZZARD_CALLBACK: Joi.string().required(),
        MINIMUM_CHARACTER_LEVEL: Joi.number().default(110),
        CODECOV_TOKEN: Joi.string(),
        DISCORD_CLIENT_ID: Joi.string().required(),
        DISCORD_SECRET: Joi.string().required(),
        DISCORD_WEBHOOK: Joi.string().required(),
        DISCORD_CALLBACK: Joi.string().default('http://localhost:3030/callback'),
        BASE_URL: Joi.string().default('http://localhost:3030/'),
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'blizzard',
    }),
    MikroOrmModule.forRoot(MikroOrmConfig),
    AccessControlModule.forRoles(roleBuilder),
    DiscordModule.forRoot({
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MEMBERS',
          'GUILD_MESSAGES',
          'GUILD_VOICE_STATES',
          'GUILD_MESSAGE_REACTIONS',
          'DIRECT_MESSAGE_REACTIONS',
        ],
      },
    }),
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
    RaiderIOModule,
  ],
})
export class AppModule {}
