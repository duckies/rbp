import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import { CharacterConflictException } from '../blizzard/exceptions/character-conflict.exception';
import { CharacterMediaSummary, CharacterProfileSummary } from '../blizzard/interfaces/profile';
import { User } from '../user/user.entity';
import { Entity, Unique, PrimaryKey, Property, Enum, ManyToOne } from 'mikro-orm';

@Entity()
@Unique({ name: 'unique_character', properties: ['name', 'realm', 'region'] })
// @Index('lower_char_index', { synchronize: false })
// @Index('character_realm_enum', { synchronize: false })
export class GuildCharacter {
  @PrimaryKey()
  id!: number;

  @Property()
  region!: string;

  @Enum(() => RealmSlug)
  realm!: RealmSlug;

  @Property()
  name!: string;

  @Property({ type: 'smallint' })
  class_id!: number;

  @Property()
  class_name!: string;

  @Property({ type: 'smallint' })
  race_id!: number;

  @Property()
  race_name!: string;

  @Property()
  gender!: string;

  @Property({ type: 'smallint' })
  level!: number;

  @Property()
  avatar_url?: string;

  @Property()
  bust_url?: string;

  @Property()
  render_url?: string;

  @Property()
  faction?: string;

  @Property()
  achievement_points: number;

  @Property()
  guild_id?: number;

  @Property()
  guild_name?: string;

  @Property()
  guild_realm?: string;

  @Property()
  guild_rank?: number;

  @Property()
  title?: string;

  @Property()
  active_spec_name: string;

  @Property({ type: 'smallint' })
  average_item_level: number;

  @Property({ type: 'smallint' })
  equipped_item_level: number;

  @Property({ nullable: true })
  specIcon: string;

  @Property({ type: 'smallint' })
  mountsCollected?: number;

  @Property({ type: 'smallint' })
  mountsNotCollected?: number;

  @Property({ type: 'smallint' })
  petsCollected?: number;

  @Property({ type: 'smallint' })
  petsNotCollected?: number;

  @Property()
  honorableKills?: number;

  @Property()
  status?: string;

  @Property()
  retries = 0;

  @ManyToOne()
  account?: User;

  @Property()
  lastLogin: Date;

  @Property()
  missingSince?: Date;

  @Property({ default: false })
  isDeleted = false;

  // Internal use only for tracking non-updated characters.
  @Property({ persist: false })
  notUpdated: boolean;

  doesNotMatch(data: CharacterProfileSummary): boolean {
    // Characters are no longer valid if their id changes.
    if (data.id !== this.id) {
      return true;
    }

    // Character classes are immutable.
    if (this.class_id !== data.character_class.id) {
      return true;
    }

    // Character level cannot go down. Note: This may delete everything on a level squish.
    if (this.level && data.level && this.level > data.level) {
      return true;
    }

    return false;
  }

  isModifiedSince(lastUpdated: number): boolean {
    return this.lastLogin < new Date(lastUpdated);
  }

  mergeProfileIndex(data: CharacterProfileSummary): GuildCharacter {
    if (this.id && this.id !== data.id) {
      throw new CharacterConflictException(this.name, this.realm);
    }

    this.name = data.name;
    this.realm = RealmSlug.Area52;
    this.region = Region.US;

    this.id = data.id;

    // Check for players not in the guild anymore.
    this.guild_id = data.guild.id;
    this.guild_name = data.guild.name;
    this.guild_realm = data.guild.realm.name;

    this.race_id = data.race.id;
    this.gender = data.gender.name;
    this.faction = data.faction.name;
    this.race_id = data.race.id;
    this.race_name = data.race.name;
    this.class_id = data.character_class.id;
    this.class_name = data.character_class.name;
    this.active_spec_name = data.active_spec.name;

    this.guild_id = data.guild.id;
    this.guild_name = data.guild.name;
    this.guild_realm = data.guild.realm.name;

    this.level = data.level;

    this.achievement_points = data.achievement_points;

    this.lastLogin = new Date(data.last_login_timestamp);
    this.average_item_level = data.average_item_level;
    this.equipped_item_level = data.equipped_item_level;

    this.title = data.active_title ? data.active_title.display_string : null;

    return this;
  }

  mergeProfileMedia(data: CharacterMediaSummary): GuildCharacter {
    this.avatar_url = data.avatar_url;
    this.bust_url = data.bust_url;
    this.render_url = data.render_url;

    return this;
  }
}
