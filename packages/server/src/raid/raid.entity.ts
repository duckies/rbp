import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { RaidNight } from '../raid-night/raid-night.entity';
import { Expansion } from './enums/expansion.enum';

@Entity()
export class Raid {
  @PrimaryKey()
  slug!: string;

  [PrimaryKeyType]: string;

  @Property({ nullable: true, unique: true })
  zoneId?: number;

  @Property({ nullable: true })
  name?: string;

  @Enum({ items: () => Expansion, nullable: true })
  expansion?: Expansion;

  @Property({ nullable: true })
  background?: string;

  @Property({ columnType: 'decimal', default: 0 })
  progress!: number;

  @Property({ default: 'Normal' })
  difficulty!: string;

  @Property({ default: 0 })
  world!: number;

  @Property({ default: 0 })
  region!: number;

  @Property({ default: 0 })
  realm!: number;

  @Property()
  summary!: string;

  @Property()
  bosses!: number;

  @Property()
  normal_bosses_killed!: number;

  @Property()
  heroic_bosses_killed!: number;

  @Property()
  mythic_bosses_killed!: number;

  @Property({ index: true })
  isFeatured: boolean = false;

  @Property()
  order: number = 0;

  @Property()
  locked: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => RaidNight, 'raid', { eager: true })
  raidNights = new Collection<RaidNight>(this);
}
