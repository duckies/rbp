import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { RealmSlug } from '../blizzard/enum/realm.enum';
import { Region } from '../blizzard/enum/region.enum';
import { CharacterConflictException } from '../blizzard/exceptions/character-conflict.exception';
import { CharacterMediaSummary, CharacterProfileSummary } from '../blizzard/interfaces/profile';
import { User } from '../user/user.entity';

@Entity('character')
@Unique('UNIQUE_CHARACTER', ['name', 'realm', 'region'])
@Index('lower_char_index', { synchronize: false })
@Index('character_realm_enum', { synchronize: false })
export class Character extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  region: string;

  @Column({ type: 'enum', enum: RealmSlug })
  realm: RealmSlug;

  @Column()
  name: string;

  @Column({ type: 'smallint' })
  class_id: number;

  @Column()
  class_name: string;

  @Column({ type: 'smallint' })
  race_id: number;

  @Column()
  race_name: string;

  @Column()
  gender: string;

  @Column({ type: 'smallint' })
  level: number;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  bust_url: string;

  @Column({ nullable: true })
  render_url: string;

  @Column()
  faction: string;

  @Column()
  achievement_points: number;

  @Column({ nullable: true })
  guild_id: number;

  @Column({ nullable: true })
  guild_name: string;

  @Column({ nullable: true })
  guild_realm: string;

  @Column({ nullable: true })
  guild_rank: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  active_spec_name: string;

  @Column({ type: 'smallint' })
  average_item_level: number;

  @Column({ type: 'smallint' })
  equipped_item_level: number;

  @Column({ nullable: true })
  specIcon: string;

  @Column({ type: 'smallint', nullable: true, select: false })
  mountsCollected: number;

  @Column({ type: 'smallint', nullable: true, select: false })
  mountsNotCollected: number;

  @Column({ type: 'smallint', nullable: true, select: false })
  petsCollected: number;

  @Column({ type: 'smallint', nullable: true, select: false })
  petsNotCollected: number;

  @Column({ nullable: true, select: false })
  honorableKills: number;

  @Column({ type: 'timestamp' })
  last_login: Date;

  @Column({ nullable: true, select: false })
  status: string;

  @Column({ default: 0, select: false })
  retries: number;

  @ManyToOne(
    () => User,
    user => user.characters,
    {
      eager: false,
      onDelete: 'SET NULL',
    },
  )
  account: User;

  @Column({ type: 'timestamp', nullable: true })
  missingSince: Date;

  @Column({ default: false })
  isDeleted: boolean;

  // Internal use only for tracking non-updated characters.
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
    return this.last_login < new Date(lastUpdated);
  }

  mergeProfileIndex(data: CharacterProfileSummary): Character {
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

    this.last_login = new Date(data.last_login_timestamp);
    this.average_item_level = data.average_item_level;
    this.equipped_item_level = data.equipped_item_level;

    this.title = data.active_title ? data.active_title.display_string : null;

    return this;
  }

  mergeProfileMedia(data: CharacterMediaSummary): Character {
    this.avatar_url = data.avatar_url;
    this.bust_url = data.bust_url;
    this.render_url = data.render_url;

    return this;
  }
}
