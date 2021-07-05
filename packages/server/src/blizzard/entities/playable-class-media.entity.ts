import { Entity, Property } from '@mikro-orm/core';

@Entity({ tableName: 'blizzard_playable_class_media' })
export class PlayableClassMedia {
  @Property({ primary: true })
  id!: number;

  @Property()
  key!: string;

  @Property()
  value!: string;
}
