import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class RaidScheduler {
  constructor(@InjectQueue('raid') private readonly queue: Queue) {}

  @Cron('0 * * * *')
  private updateRaids(): void {
    this.queue.add('updateRaids');
  }
}
