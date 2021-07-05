import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { PlayableClassMedia } from './playable-class-media.entity';
import { PlayableSpecialization } from './playable-specialization.entity';

@Entity({ tableName: 'blizzard_playable_class' })
export class PlayableClass {
  @Property({ primary: true })
  id!: number;

  @Property()
  name!: string;

  @OneToOne(() => PlayableClassMedia)
  media!: PlayableClassMedia;

  @OneToMany(() => PlayableSpecialization, (s) => s.class)
  specializations = new Collection<PlayableSpecialization>(this);
}
