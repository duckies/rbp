import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/profile.service';
import { RaiderIOCharacterFields } from '../raiderIO/dto/char-fields.dto';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { UpdateFormCharacterDto } from './dto/update-form-character.dto';
import { FormCharacter } from './form-character.entity';

@Injectable()
export class FormCharacterService {
  constructor(
    @InjectRepository(FormCharacter)
    private readonly formCharacterRepository: EntityRepository<FormCharacter>,
    private readonly profileService: ProfileService,
    private readonly raiderIOService: RaiderIOService,
  ) {}

  async create(findCharacterDto: FindCharacterDto, flush = false) {
    const formCharacter = new FormCharacter(
      findCharacterDto.name,
      findCharacterDto.realm,
      findCharacterDto.region,
    );

    const [summary, specs, media, raids, equipment, raiderIO] = await Promise.all(
      [
        this.profileService.getCharacterProfileSummary(findCharacterDto),
        this.profileService.getCharacterSpecializationsSummary(findCharacterDto),
        this.profileService.getCharacterMediaSummary(findCharacterDto),
        this.profileService.getCharacterRaids(findCharacterDto),
        this.profileService.getCharacterEquipmentSummary(findCharacterDto),
        this.raiderIOService.getCharacterRaiderIO(findCharacterDto, [
          RaiderIOCharacterFields.GEAR,
          RaiderIOCharacterFields.RAID_PROGRESSION,
          RaiderIOCharacterFields.MYTHIC_PLUS_BEST_RUNS,
          RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
        ]),
      ].map((p: any) => p.catch((e) => e)), // Not sure what is wrong with this.
    );

    if (!(summary instanceof Error)) {
      formCharacter.setCharacterProfileSummary(summary);
    }

    if (!(specs instanceof Error)) {
      formCharacter.setCharacterSpecializationsSummary(specs);
    }

    if (!(media instanceof Error)) {
      formCharacter.setCharacterMediaSummary(media);
    }

    if (!(raids instanceof Error)) {
      formCharacter.setCharacterRaidEncounterSummary(raids);
    }

    if (!(equipment instanceof Error)) {
      formCharacter.setCharacterEquipmentSummary(equipment);
    }

    if (!(raiderIO instanceof Error)) {
      formCharacter.setCharacterRaiderIO(raiderIO);
    }

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

  findAll() {
    return this.formCharacterRepository.find({});
  }

  async update(id: number, updateFormCharacterDto: UpdateFormCharacterDto) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    formCharacter.assign(updateFormCharacterDto);

    await this.formCharacterRepository.flush();

    return formCharacter;
  }

  async delete(id: number) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    return this.formCharacterRepository.remove(formCharacter);
  }
}
