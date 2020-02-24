import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserQueue } from './user.queue';
import { UserScheduler } from './user.scheduler';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BullModule.registerQueue({ name: 'user' })],
  controllers: [UserController],
  providers: [UserService, UserQueue, UserScheduler],
  exports: [UserService],
})
export class UserModule {}
