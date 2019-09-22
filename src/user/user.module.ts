import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UserQueue } from './user.queue';
import { UserScheduler } from './user.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, UserQueue, UserScheduler],
  exports: [UserService],
})
export class UserModule {}
