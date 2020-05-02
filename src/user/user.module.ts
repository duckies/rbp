import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserQueue } from './user.queue';
import { UserScheduler } from './user.scheduler';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] }), BullModule.registerQueue({ name: 'user' })],
  controllers: [UserController],
  providers: [UserService, UserQueue, UserScheduler],
  exports: [UserService],
})
export class UserModule {}
