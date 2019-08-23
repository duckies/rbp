import { Injectable } from '@nestjs/common';
import { NestSchedule, Timeout } from 'nest-schedule';
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

  @Timeout(15000)
  async updateUserRoles() {
    this.queue.add('updateUserRoles');
  }
}