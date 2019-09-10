import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { CharacterResponse } from '../interfaces/character-response.interface';
import { CharacterConflictException } from '../blizzard/exceptions/character-conflict.exception';
import { RealmName } from '../interfaces/realm.enum';

@Entity('character')
@Unique('UNIQUE_CHARACTER', ['name', 'realm', 'region'])
@Index('lower_char_index', { synchronize: false })
@Index('character_realm_enum', { synchronize: false })
export class Character extends BaseEntity {
  constructor(name?: string, realm?: RealmName, region?: string) {
    super();

    this.name = name;
    this.realm = realm;
    this.region = region;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  region: string;

  @Column({ type: 'enum', enum: RealmName })
  realm: RealmName;

  @Column()
  name: string;

  @Column({ type: 'smallint' })
  class: number;

  @Column({ type: 'smallint' })
  race: number;

  @Column({ type: 'smallint' })
  gender: number;

  @Column({ type: 'smallint' })
  level: number;

  @Column()
  thumbnail: string;

  @Column({ type: 'smallint' })
  faction: number;

  @Column()
  achievementPoints: number;

  @Column({ nullable: true })
  guild: string;

  @Column({ nullable: true })
  guildRank: number;

  @Column({ type: 'jsonb', nullable: true, select: false })
  items: any;

  @Column({ type: 'jsonb', nullable: true, select: false })
  professions: any;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  spec: string;

  @Column({ nullable: true })
  specIcon: string;

  @Column({ type: 'jsonb', nullable: true, select: false })
  talents: any;

  @Column({ type: 'smallint', nullable: true, select: false })
  mountsCollected: number;

  @Column({ type: 'smallint', nullable: true, select: false })
  mountsNotCollected: number;

  @Column({ type: 'smallint', nullable: true, select: false })
  petsCollected: number;

  @Column({ type: 'smallint', nullable: true, select: false })
  petsNotCollected: number;

  @Column({ type: 'jsonb', nullable: true, select: false })
  progression: any;

  @Column({ type: 'jsonb', nullable: true, select: false })
  pvp: any;

  @Column({ nullable: true, select: false })
  honorableKills: number;

  @Column({ type: 'timestamp' })
  lastModified: Date;

  @Column({ nullable: true, select: false })
  status: string;

  @Column({ default: 0, select: false })
  retries: number;

  @ManyToOne(type => User, user => user.characters, {
    eager: false,
    onDelete: 'SET NULL',
  })
  account: User;

  @Column({ type: 'timestamp', nullable: true })
  missingSince: Date;

  @Column({ default: false })
  isDeleted: boolean;

  // Internal use only for tracking non-updated characters.
  notUpdated: boolean;

  /**
   * Creates the avatar url from character information.
   * @param character
   */
  avatar(): string {
    return `http://render-${this.region}.worldofwarcraft.com/character/${
      this.thumbnail
    }?alt=/wow/static/images/2d/avatar/${this.race}-${this.gender}.jpg`;
  }

  /**
   * Removes the guild a character is in and their rank and saves.
   */
  removeGuild(): Character {
    this.guild = null;
    this.guildRank = null;

    return this;
  }

  doesNotMatch(data: CharacterResponse): boolean {
    // Character classes are immutable.
    if (this.class && data.class && this.class != data.class) {
      return true;
    }

    // Character level cannot go down. Note: This may delete everything on a level squish.
    if (this.level && data.level && this.level > data.level) {
      return true;
    }

    // Character honorable kills cannot go down.
    if (
      this.honorableKills &&
      data.totalHonorableKills &&
      this.honorableKills > data.totalHonorableKills
    ) {
      return true;
    }

    // TODO: Use more rigid collision detection using achievement dates.

    return false;
  }

  isModifiedSince(lastUpdated: number): boolean {
    return this.lastModified < new Date(lastUpdated);
  }

  mergeWith(data: CharacterResponse): Character {
    if (this.doesNotMatch(data)) {
      throw new CharacterConflictException(this.name, this.realm);
    }

    this.class = data.class;
    this.race = data.race;
    this.gender = data.gender;
    this.level = data.level;
    this.thumbnail = data.thumbnail;
    this.achievementPoints = data.achievementPoints;
    this.faction = data.faction;
    this.lastModified = new Date(data.lastModified);

    if ('guild' in data) this.guild = data.guild.name;
    if ('items' in data) this.items = data.items;
    if ('professions' in data) this.professions = data.professions;
    if ('progression' in data) this.progression = data.progression;
    if ('pvp' in data) this.pvp = data.pvp;
    if ('totalHonorableKills' in data)
      this.honorableKills = data.totalHonorableKills;

    if ('titles' in data) {
      let hasSetTitle: boolean = false;

      for (const title in data.titles) {
        if (data.titles[title].selected) {
          hasSetTitle = true;
          this.title = data.titles[title].name;
          break;
        }
      }

      if (!hasSetTitle) this.title = null;
    }

    if ('talents' in data) {
      for (const spec of data.talents) {
        if (spec.selected) {
          this.spec = spec.spec.name;
          this.specIcon = spec.spec.icon;
          break;
        }
      }

      this.talents = data.talents;
    }

    if ('mounts' in data) {
      this.mountsCollected = data.mounts.numCollected;
      this.mountsNotCollected = data.mounts.numNotCollected;
    }

    if ('pets' in data) {
      this.petsCollected = data.pets.numCollected;
      this.petsNotCollected = data.pets.numNotCollected;
    }

    return this;
  }
}
