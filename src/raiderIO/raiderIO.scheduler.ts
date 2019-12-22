import { NestSchedule, Cron } from 'nest-schedule';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';

@Injectable()
export class RaiderIOScheduler extends NestSchedule {
  private readonly logger: Logger = new Logger(RaiderIOScheduler.name);

  constructor(
    @InjectQueue('raiderIO')
    private readonly queue: Queue,
  ) {
    super();
  }

  @Cron('0 * * * *')
  updateGuildRaiderIO(): void {
    this.queue.add('updateGuildRaiderIO', null);
  }
}
