import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Provider } from '../auth/auth.service';
import { JWTPayload } from '../auth/dto/jwt.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(blizzardid: number, battletag: string, blizzardtoken: string) {
    return this.userRepository.save({ blizzardid, battletag, blizzardtoken });
  }

  async findAll(
    take: number = 100,
    skip: number = 0,
  ): Promise<{ result: User[]; total: number }> {
    const [result, total] = await this.userRepository.findAndCount({
      order: { id: 'DESC' },
      take,
      skip,
    });

    return { result, total };
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  findOneByJwtPayload(payload: JWTPayload): Promise<User> {
    return this.userRepository.findOneOrFail(payload.id);
  }

  findOneByProviderId(thirdPartyId: number, provider: Provider) {
    if (provider === Provider.BLIZZARD) {
      return this.userRepository.findOneOrFail({ blizzardid: thirdPartyId });
    }

    return Promise.reject();
  }

  findAllWithGuildCharacters() {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.characters', 'character')
      .where('character.guild = :guild', { guild: 'Really Bad Players'})
      .andWhere('character.guildRank is not null')
      .getMany();
    }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);

    const result = await this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(result);
  }
}
