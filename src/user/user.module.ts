import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserQueue } from './user.queue';
import { UserScheduler } from './user.scheduler';
import { UserService } from './user.service';
<<<<<<< HEAD

@Module({
  imports: [TypeOrmModule.forFeature([User])],
=======
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BullModule.registerQueue({ name: 'user' })],
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  controllers: [UserController],
  providers: [UserService, UserQueue, UserScheduler],
  exports: [UserService],
})
export class UserModule {}
