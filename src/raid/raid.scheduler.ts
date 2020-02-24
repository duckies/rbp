import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
<<<<<<< HEAD
import { InjectQueue } from 'nest-bull';
=======
import { InjectQueue } from '@nestjs/bull';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { Cron, NestSchedule } from 'nest-schedule';

@Injectable()
export class RaidScheduler extends NestSchedule {
  private readonly logger: Logger = new Logger(RaidScheduler.name);

  constructor(@InjectQueue('raid') private readonly queue: Queue) {
    super();
  }

<<<<<<< HEAD
  @Cron('0 0 * ? * *')
  private updateRaids(): void {
    this.queue.add('updateRaids')
=======
  @Cron('0 * * * *')
  private updateRaids(): void {
    this.queue.add('updateRaids');
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  }
}
