import { Injectable } from '@nestjs/common';
import { EntityRepository, wrap } from 'mikro-orm';
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

  public async upsert(findCharacterDto: FindCharacterDto) {
    const formCharacter = await this.formCharacterRepository.findOne({ ...findCharacterDto });

    if (!formCharacter) {
      return await this.create(findCharacterDto);
    }

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

  public async populateFormCharacter(formCharacter: FormCharacter) {
    const [summary, specs, media, raids, equipment, raiderIO] = await Promise.allSettled([
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
    ]);

    if (summary.status === 'fulfilled') {
      formCharacter.setCharacterProfileSummary(summary.value.data);
    }

    if (specs.status === 'fulfilled') {
      formCharacter.setCharacterSpecializationsSummary(specs.value.data);
    }

    if (media.status === 'fulfilled') {
      formCharacter.setCharacterMediaSummary(media.value.data);
    }

    if (raids.status === 'fulfilled') {
      formCharacter.setCharacterRaidEncounterSummary(raids.value.data);
    }

    if (equipment.status === 'fulfilled') {
      formCharacter.setCharacterEquipmentSummary(equipment.value);
    }

    if (raiderIO.status === 'fulfilled') {
      formCharacter.setCharacterRaiderIO(raiderIO.value);
    }

    return formCharacter;
  }

  public findAll() {
    return this.formCharacterRepository.find({});
  }

  public async update(id: number, updateFormCharacterDto: UpdateFormCharacterDto) {
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
