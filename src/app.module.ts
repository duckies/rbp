import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { Connection } from 'typeorm';
import { roleBuilder } from './app.roles';
import { FormModule } from './application/form/form.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { BullSharedModule } from './bull.module';
import { ConfigModule } from './config/config.module';
import { SlideModule } from './slide/slide.module';
import { UserModule } from './user/user.module';
import { RaidModule } from './warcraft/raid/raid.module';
import { WarcraftModule } from './warcraft/warcraft.module';

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
    WarcraftModule,
    FormModule,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
