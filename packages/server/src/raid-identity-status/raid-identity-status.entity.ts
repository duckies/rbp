import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RaidIdentity } from '../raid-identity/raid-identity.entity';
import { RaidNight } from '../raid-night/raid-night.entity';
import { IdentityStatus } from './enums/character-status.enum';

@Entity()
export class RaidIdentityStatus {
  @PrimaryKey()
  id!: number;

  @Enum(() => IdentityStatus)
  status!: IdentityStatus;

  @Property()
  points!: number;

  @Property({ columnType: 'text', nullable: true })
  note?: string;

  @OneToOne(() => RaidIdentity, null)
  identity!: RaidIdentity;

  @ManyToOne(() => RaidNight)
  raidNight!: RaidNight;
}
