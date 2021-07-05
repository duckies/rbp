import {
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { RealmSlug } from '../../blizzard/enums/realm.enum';
import { Region } from '../../blizzard/enums/region.enum';
import { GuildCharacter } from '../../guild-character/character.entity';
import { RaidRole } from '../interfaces/raid-role.enum';

@Entity()
@Unique({ properties: ['name', 'realm', 'region'] })
export class RaidIdentity {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Enum(() => RealmSlug)
  realm!: RealmSlug;

  @Enum(() => Region)
  region!: Region;

  @Property({ nullable: true, unique: true })
  discordTag?: string;

  @Enum(() => RaidRole)
  role!: RaidRole;

  @OneToOne(() => GuildCharacter, null, { nullable: true })
  character?: GuildCharacter;
}
