import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { RaiderIOCharacterFields } from '../raider.io/dto/char-fields.dto';
import { RaiderIOService } from '../raider.io/raiderIO.service';
import { RoleType } from '../warcraftlogs/interfaces/role-type.enum';
import { WarcraftLogsService } from '../warcraftlogs/warcraftlogs.service';
import { UpdateFormCharacterDto } from './dto/update-form-character.dto';
import { FormCharacter } from './form-character.entity';

@Injectable()
export class FormCharacterService {
  constructor(
    @InjectRepository(FormCharacter)
    private readonly formCharacterRepository: EntityRepository<FormCharacter>,
    private readonly profileService: ProfileService,
    private readonly raiderIOService: RaiderIOService,
    private readonly warcraftLogsService: WarcraftLogsService,
    private readonly em: EntityManager,
  ) {}

  public async upsert(findCharacterDto: FindCharacterDto) {
    const formCharacter = await this.formCharacterRepository.findOne({
      ...findCharacterDto,
    });

    if (!formCharacter) return this.create(findCharacterDto);

    await this.populateFormCharacter(formCharacter);

    return formCharacter;
  }

  public async create(findCharacterDto: FindCharacterDto, flush = false) {
    const formCharacter = new FormCharacter(
      findCharacterDto.name,
      findCharacterDto.realm,
      findCharacterDto.region,
    );

    await this.populateFormCharacter(formCharacter);

    if (flush) {
      try {
        await this.formCharacterRepository.flush();
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    return formCharacter;
  }

  public async populateFormCharacter(
    formCharacter: FormCharacter,
    em?: EntityManager,
  ) {
    const dto = formCharacter.getFindCharacterDTO();

    const [
      summary,
      equipment,
      specs,
      media,
      raids,
      raiderIO,
      rankingsDPS,
      rankingsHeal,
      rankingsTank,
    ] = await Promise.allSettled([
      this.profileService.getCharacterProfileSummary(dto),
      this.profileService.getCharacterEquipmentSummary(dto),
      this.profileService.getCharacterSpecializationsSummary(dto),
      this.profileService.getCharacterMediaSummary(dto),
      this.profileService.getCharacterRaids(dto),
      this.raiderIOService.getCharacterRaiderIO(dto, [
        RaiderIOCharacterFields.GEAR,
        RaiderIOCharacterFields.RAID_PROGRESSION,
        RaiderIOCharacterFields.MYTHIC_PLUS_BEST_RUNS,
        RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
      ]),

      this.warcraftLogsService.getCharacterRankings(dto, null, RoleType.DPS),
      this.warcraftLogsService.getCharacterRankings(dto, null, RoleType.Healer),
      this.warcraftLogsService.getCharacterRankings(dto, null, RoleType.Tank),
    ]);

    if (summary.status === 'fulfilled') {
      formCharacter.setCharacterProfileSummary(
        summary.value.data,
        em || this.em,
      );
    }

    if (specs.status === 'fulfilled') {
      formCharacter.setCharacterSpecializationsSummary(
        specs.value.data,
        em || this.em,
      );
    }

    if (media.status === 'fulfilled') {
      formCharacter.setCharacterMediaSummary(media.value.data);
    }

    if (raids.status === 'fulfilled') {
      formCharacter.setCharacterRaidEncounterSummary(raids.value.data);
    }

    if (equipment.status === 'fulfilled') {
      formCharacter.setCharacterEquipmentSummary(equipment.value.data);
    }

    if (raiderIO.status === 'fulfilled') {
      formCharacter.setCharacterRaiderIO(raiderIO.value);
    }

    if (rankingsDPS.status === 'fulfilled') {
      formCharacter.setCharacterRankings(RoleType.DPS, rankingsDPS.value);
    }

    if (rankingsHeal.status === 'fulfilled') {
      formCharacter.setCharacterRankings(RoleType.Healer, rankingsHeal.value);
    }

    if (rankingsTank.status === 'fulfilled') {
      formCharacter.setCharacterRankings(RoleType.Tank, rankingsTank.value);
    }

    await this.em.populate(formCharacter, [
      'class.media',
      'specialization.media',
    ]);

    return formCharacter;
  }

  public findAll() {
    return this.formCharacterRepository.findAll();
  }

  public async update(
    id: number,
    updateFormCharacterDto: UpdateFormCharacterDto,
  ) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    wrap(formCharacter).assign(updateFormCharacterDto);

    await this.formCharacterRepository.flush();

    return formCharacter;
  }

  public async delete(id: number) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    return this.formCharacterRepository.remove(formCharacter);
  }
}
