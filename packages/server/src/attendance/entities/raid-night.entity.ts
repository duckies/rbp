import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RaidCharacterStatus } from './raid-character-status.entity';

@Entity()
export class RaidNight {
  @PrimaryKey()
  id!: number;

  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @Property()
  optional: boolean = false;

  @OneToMany(() => RaidCharacterStatus, 'raidNight')
  statuses = new Collection<RaidCharacterStatus>(this);
}
