<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
=======
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { Cron, NestSchedule } from 'nest-schedule';

@Injectable()
export class UserScheduler extends NestSchedule {
  constructor(
    @InjectQueue('user')
    private readonly queue: Queue,
  ) {
    super();
  }

  @Cron('0 * * * *')
  updateUserRoles(): void {
    this.queue.add('updateUserRoles');
  }
}
