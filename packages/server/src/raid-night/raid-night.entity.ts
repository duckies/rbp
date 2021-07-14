import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RaidIdentityStatus } from '../raid-identity-status/raid-identity-status.entity';
import { Raid } from '../raid/raid.entity';

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

  @ManyToOne(() => Raid, { nullable: true })
  raid?: Raid;

  @OneToMany(() => RaidIdentityStatus, 'raidNight', { eager: true })
  statuses = new Collection<RaidIdentityStatus>(this);
}
