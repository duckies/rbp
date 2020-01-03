import { Logger } from '@nestjs/common';
import { Process, Processor } from 'nest-bull';
import { User } from './user.entity';
import { UserService } from './user.service';

@Processor({ name: 'user' })
export class UserQueue {
  private readonly logger: Logger = new Logger(UserQueue.name);

  constructor(private readonly userService: UserService) {}

  // @Process({ name: 'updateUserRoles', concurrency: 1 })
  // private async updateUserRoles(): Promise<User[]> {
  //   const users = await this.userService.findAllWithGuildCharacters();

  //   console.log(users);

  //   const promises = [];
  //   for (const user of users) {
  //     // The highest rank is actually the lowest in the game.
  //     const rank = Math.min(...user.characters.map(c => c.rank), NumRanks - 1);

  //     user.roles = [Ranks[rank]];
  //     promises.push(user.save());
  //   }

  //   return Promise.all(promises);
  // }
}
