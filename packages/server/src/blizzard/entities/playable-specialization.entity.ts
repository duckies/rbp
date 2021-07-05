import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PlayableClass } from './playable-class.entity';
import { PlayableSpecializationMedia } from './playable-specialization-media.entity';

@Entity({ tableName: 'blizzard_playable_specialization' })
export class PlayableSpecialization {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @ManyToOne(() => PlayableSpecializationMedia)
  media!: PlayableSpecializationMedia;

  @ManyToOne(() => PlayableClass)
  class!: PlayableClass;
}
