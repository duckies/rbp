// import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { ScheduleModule } from '@nestjs/schedule';
// import path from 'path';
// import MikroOrmConfig from '../mikro-orm.config';
// import { AuthModule } from './auth/auth.module';
// import { BlizzardModule } from './blizzard/blizzard.module';
// import { ConfigModule } from './config/config.module';
// import { configSchema } from './config/config.schema';
// import { DiscordModule } from './discord/discord.module';
// import { FormCharacterModule } from './form-character/form-character.module';
// import { FormSubmissionModule } from './form-submission/form-submission.module';
// import { FormModule } from './form/form.module';
// import { GuildCharacterModule } from './guild-character/character.module';
// import { PostModule } from './post/post.module';
// import { RaidIdentityStatusModule } from './raid-identity-status/raid-identity-status.module';
// import { RaidIdentityModule } from './raid-identity/raid-identity.module';
// import { RaidNightModule } from './raid-night/raid-night.module';
// import { RaidModule } from './raid/raid.module';
// import { RaiderIOModule } from './raider.io/raiderIO.module';
// import { SlideModule } from './slide/slide.module';
// import { UserModule } from './user/user.module';
// import { WarcraftLogsModule } from './warcraftlogs/warcraftlogs.module';
// import { RavenInterceptor, RavenModule } from 'nest-raven';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { TestModule } from './test/test.module.js';

@Module({
  imports: [TestModule],
  //   RavenModule,
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //     envFilePath: path.resolve(__dirname, '../backend.env'),
  //     validationSchema: configSchema,
  //   }),
  //   MikroOrmModule.forRoot(MikroOrmConfig),
  //   WarcraftLogsModule,
  //   PassportModule.register({
  //     defaultStrategy: 'blizzard',
  //   }),
  //   DiscordModule.forRoot({
  //     partials: ['REACTION', 'CHANNEL', 'MESSAGE', 'USER', 'GUILD_MEMBER'],
  //     ws: {
  //       intents: [
  //         'GUILDS',
  //         'GUILD_MEMBERS',
  //         'GUILD_MESSAGES',
  //         'GUILD_VOICE_STATES',
  //         'GUILD_MESSAGE_REACTIONS',
  //         'GUILD_PRESENCES',
  //       ],
  //     },
  //   }),
  //   ScheduleModule.forRoot(),
  //   ConfigModule,
  //   UserModule,
  //   AuthModule,
  //   SlideModule,
  //   PostModule,
  //   GuildCharacterModule,
  //   RaidModule,
  //   RaidIdentityModule,
  //   RaidIdentityStatusModule,
  //   RaidNightModule,
  //   FormModule,
  //   FormCharacterModule,
  //   FormSubmissionModule,
  //   BlizzardModule,
  //   RaiderIOModule,
  // ],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useValue: new RavenInterceptor({
  //       filters: [
  //         {
  //           type: HttpException,
  //           filter: (exception: HttpException) => 500 > exception.getStatus(),
  //         },
  //       ],
  //     }),
  //   },
  // ],
})
export class AppModule {}
