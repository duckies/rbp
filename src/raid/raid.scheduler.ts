import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { Cron, NestSchedule, Timeout } from 'nest-schedule';

@Injectable()
export class RaidScheduler extends NestSchedule {
  private readonly logger: Logger = new Logger(RaidScheduler.name);

  constructor(@InjectQueue('raid') private readonly queue: Queue) {
    super();
  }

  // @Cron('0 0 * ? * *')
  @Timeout(1000)
  private updateRaids(): void {
    this.queue.add('updateRaids');
  }
}
