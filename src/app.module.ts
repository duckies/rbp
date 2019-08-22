import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'typeorm';
import { ConfigModule } from './config/config.module';
import { SlideModule } from './slide/slide.module';
import { AccessControlModule } from 'nest-access-control';
import { roleBuilder } from './app.roles';
import { ArticleModule } from './article/article.module';
import { PassportModule } from '@nestjs/passport';
import { RaidModule } from './warcraft/raid/raid.module';
import { WarcraftModule } from './warcraft/warcraft.module';
import { SharedBullModule } from './bull.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'blizzard',
    }),
    TypeOrmModule.forRoot(),
    AccessControlModule.forRoles(roleBuilder),
    ConfigModule,
    UserModule,
    AuthModule,
    SlideModule,
    ArticleModule,
    RaidModule,
    WarcraftModule,
    SharedBullModule
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
