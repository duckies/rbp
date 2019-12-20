import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
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
