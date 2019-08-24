import { Queue, QueueProcess } from 'nest-bull';
import { Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { Job } from 'bull';
import { NumRanks, Ranks } from '../app.roles';

@Queue({ name: 'user' })
export class UserQueue {
  private readonly logger: Logger = new Logger(UserQueue.name);

  constructor(private readonly userService: UserService) {}

  @QueueProcess({ name: 'updateUserRoles', concurrency: 1 })
  private async updateUserRoles(job: Job<Number>) {
    const users = await this.userService.findAllWithGuildCharacters();

    console.log(users);

    const promises = [];
    for (const user of users) {
      // The highest rank is actually the lowest in the game.
      const rank = Math.min(
        ...user.characters.map(c => c.guildRank),
        NumRanks - 1,
      );

      user.roles = [Ranks[rank]];
      promises.push(user.save());
    }

    return Promise.all(promises);
  }
}
