import { Entity, Enum, PrimaryKey, Property, WrappedEntity } from 'mikro-orm';
import { Expansion } from './enums/expansion.enum';
import { DecimalType } from '../../config/types/decimal.type';

@Entity()
export class Raid {
  constructor(slug: string) {
    this.slug = slug;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name?: string;

  @Property({ unique: true })
  slug!: string;

  @Enum({ items: () => Expansion, nullable: true })
  expansion?: Expansion;

  @Property({ nullable: true })
  background?: string;

  @Property({ type: DecimalType })
  progress!: number;

  @Property()
  difficulty!: string;

  @Property()
  world!: number;

  @Property()
  region!: number;

  @Property()
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
  isFeatured = false;

  @Property()
  order = 0;

  @Property()
  locked = false;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Raid extends WrappedEntity<Raid, 'id'> {}
