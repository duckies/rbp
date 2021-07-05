import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CharacterStatus } from '../interfaces/character-status.enum';
import { RaidIdentity } from './raid-identity.entity';
import { RaidNight } from './raid-night.entity';

@Entity()
export class RaidCharacterStatus {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => RaidIdentity, null)
  identity!: RaidIdentity;

  @Enum(() => CharacterStatus)
  status!: CharacterStatus;

  @Property()
  points!: number;

  @ManyToOne(() => RaidNight)
  raidNight!: RaidNight;
}
