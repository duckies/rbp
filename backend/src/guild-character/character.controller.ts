import { expr, QueryOrder } from '@mikro-orm/core';
import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { CharacterService } from './character.service';

@Controller('characters')
@UseInterceptors(CacheInterceptor)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('roster')
  @CacheTTL(600)
  async getRoster() {
    const [characters, count] = await this.characterService.findAll(
      {
        guild_rank: { $in: [0, 1, 3, 4, 5] },
      },
      null,
      null,
      {
        guild_rank: QueryOrder.ASC,
        name: QueryOrder.ASC,
      },
    );

    // Do not try to cache entities, only their representational JSON.
    return [characters.map((c) => c.toJSON()), count];
  }

  @Get('/:region/:realm/:name')
  findOne(@Param() { name, realm, region }: FindCharacterDto) {
    return this.characterService.findOneOrFail({
      [expr('LOWER(name)')]: name.toLowerCase(),
      realm,
      region,
    });
  }
}
