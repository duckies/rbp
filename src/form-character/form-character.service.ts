import { UpdateFormCharacterDto } from './dto/update-form-character.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/profile.service';
import { RaiderIOCharacterFields } from '../raiderIO/dto/char-fields.dto';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { FormCharacter } from './form-character.entity';

@Injectable()
export class FormCharacterService {
  constructor(
    @InjectRepository(FormCharacter)
    private readonly formCharacterRepository: Repository<FormCharacter>,
    private readonly profileService: ProfileService,
    private readonly raiderIOService: RaiderIOService,
  ) {}

  async create(findCharacterDto: FindCharacterDto) {
    const formCharacter = new FormCharacter(
      findCharacterDto.name,
      findCharacterDto.realm,
      findCharacterDto.region,
    );

    const [summary, specs, media, equipment, raiderIO] = await Promise.all(
      [
        this.profileService.getCharacterProfileSummary(findCharacterDto),
        this.profileService.getCharacterSpecializationsSummary(findCharacterDto),
        this.profileService.getCharacterMediaSummary(findCharacterDto),
        this.profileService.getCharacterEquipmentSummary(findCharacterDto),
        this.raiderIOService.getCharacterRaiderIO(findCharacterDto, [
          RaiderIOCharacterFields.GEAR,
          RaiderIOCharacterFields.RAID_PROGRESSION,
          RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
        ]),
      ].map((p: any) => p.catch(e => e)), // Not sure what is wrong with this.
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

    if (!(equipment instanceof Error)) {
      formCharacter.setCharacterEquipmentSummary(equipment);
    }

    if (!(raiderIO instanceof Error)) {
      formCharacter.setCharacterRaiderIO(raiderIO);
    }

    return formCharacter;
  }

  findAll() {
    return this.formCharacterRepository.find();
  }

  async update(id: number, updateFormCharacterDto: UpdateFormCharacterDto) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    this.formCharacterRepository.merge(formCharacter, updateFormCharacterDto);

    return formCharacter.save();
  }

  async delete(id: number) {
    const formCharacter = await this.formCharacterRepository.findOneOrFail(id);

    return this.formCharacterRepository.remove(formCharacter);
  }
}
