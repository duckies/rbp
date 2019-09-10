import { Injectable } from '@nestjs/common';
import { NestSchedule, Timeout, Cron } from 'nest-schedule';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';

@Injectable()
export class UserScheduler extends NestSchedule {
  constructor(
    @InjectQueue('user')
    private readonly queue: Queue
  ) {
    super();
  }

  @Cron('0 * * * *')
  async updateUserRoles() {
    this.queue.add('updateUserRoles');
  }
}