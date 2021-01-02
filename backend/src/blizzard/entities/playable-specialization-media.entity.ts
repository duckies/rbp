import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { PlayableSpecializationMedia as IPlayableSpecializationMedia } from '../interfaces/game-data/playable-specialization/playable-specialization-media.interface';

@Entity({ tableName: 'blizzard_playable_specialization_media' })
export class PlayableSpecializationMedia {
  constructor(data: IPlayableSpecializationMedia) {
    this.id = data.id;
    this.key = data.assets[0].key;
    this.value = data.assets[0].value;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  key: string;

  @Property()
  value!: string;
}
