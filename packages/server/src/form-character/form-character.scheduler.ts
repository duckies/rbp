import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class FormCharacterScheduler {
  constructor(
    @InjectQueue('form-character')
    private readonly queue: Queue,
  ) {}

  @Cron('0 1-23/2 * * *')
  updateFormCharacters() {
    this.queue.add('character-update', { attempts: 1 });
  }
}
