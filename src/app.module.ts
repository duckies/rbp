import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { Connection } from 'typeorm';
import { roleBuilder } from './app.roles';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { BlizzardModule } from './blizzard/blizzard.module';
import { BullSharedModule } from './bull.module';
import { CharacterModule } from './character/character.module';
import { ConfigModule } from './config/config.module';
import { FileModule } from './file/file.module';
import { FormSubmissionModule } from './form-submission/form-submission.module';
import { FormModule } from './form/form.module';
import { TestModule } from './queue/test.module';
import { RaidModule } from './raid/raid.module';
import { RaiderIOModule } from './raiderIO/raiderIO.module';
import { SlideModule } from './slide/slide.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'blizzard',
    }),
    TypeOrmModule.forRoot(),
    AccessControlModule.forRoles(roleBuilder),
    BullSharedModule,
    ConfigModule,
    UserModule,
    AuthModule,
    SlideModule,
    ArticleModule,
    RaidModule,
    FormModule,
    FormSubmissionModule,
    FileModule,
    BlizzardModule,
    CharacterModule,
    RaiderIOModule,
    TestModule,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
