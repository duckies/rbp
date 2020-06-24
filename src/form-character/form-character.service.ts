import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/services/profile/profile.service';
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

  public async populateFormCharacter(formCharacter: FormCharacter) {
    const [summary, specs, media, raids, equipment, raiderIO] = await Promise.all(
      [
        this.profileService.getCharacterProfileSummary(formCharacter.getFindCharacterDTO()),
        this.profileService.getCharacterSpecializationsSummary(formCharacter.getFindCharacterDTO()),
        this.profileService.getCharacterMediaSummary(formCharacter.getFindCharacterDTO()),
        this.profileService.getCharacterRaids(formCharacter.getFindCharacterDTO()),
        this.profileService.getCharacterEquipmentSummary(formCharacter.getFindCharacterDTO()),
        this.raiderIOService.getCharacterRaiderIO(formCharacter.getFindCharacterDTO(), [
          RaiderIOCharacterFields.GEAR,
          RaiderIOCharacterFields.RAID_PROGRESSION,
          RaiderIOCharacterFields.MYTHIC_PLUS_BEST_RUNS,
          RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
        ]),
      ].map((p: any) => p.catch((e: Error) => e)),
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

    return formCharacter;
  }

  public findAll() {
    return this.formCharacterRepository.find({});
  }

  public async update(id: number, updateFormCharacterDto: UpdateFormCharacterDto) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    formCharacter.assign(updateFormCharacterDto);

    await this.formCharacterRepository.flush();

    return formCharacter;
  }

  public async delete(id: number) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    return this.formCharacterRepository.remove(formCharacter);
  }
}
