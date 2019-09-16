import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Provider } from '../auth/auth.service';
import { JWTPayload } from '../auth/dto/jwt.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KnownCharacter } from './interfaces/known-character.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  create(blizzardid: number, battletag: string, blizzardtoken: string) {
    return this.repository.save({
      blizzardid,
      battletag,
      blizzardtoken,
    });
  }

  async findAll(take: number = 100, skip: number = 0): Promise<{ result: User[]; total: number }> {
    const [result, total] = await this.repository.findAndCount({
      order: { id: 'DESC' },
      take,
      skip,
    });

    return { result, total };
  }

  findOne(id: number): Promise<User> {
    return this.repository.findOneOrFail(id);
  }

  findOneByJwtPayload(payload: JWTPayload): Promise<User> {
    return this.repository.findOneOrFail(payload.id);
  }

  findOneByProviderId(thirdPartyId: number, provider: Provider) {
    if (provider === Provider.BLIZZARD) {
      return this.repository.findOneOrFail({ blizzardid: thirdPartyId });
    }

    throw new BadRequestException();
  }

  findAllWithGuildCharacters() {
    return this.repository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.characters', 'character')
      .where('character.guild = :guild', { guild: 'Really Bad Players' })
      .andWhere('character.guildRank is not null')
      .getMany();
  }

  async findKnownCharacters(user: User): Promise<User> {
    return this.repository.findOne({
      select: ['knownCharacters', 'knownCharactersLastUpdated'],
      where: { id: user.id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.repository.findOneOrFail(id);

    const result = await this.repository.merge(user, updateUserDto);

    return await this.repository.save(result);
  }
}
