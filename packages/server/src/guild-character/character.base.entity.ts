import {
  BaseEntity,
  Entity,
  EntityManager,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { PlayableClass } from '../blizzard/entities/playable-class.entity';
import { PlayableSpecialization } from '../blizzard/entities/playable-specialization.entity';
import { Realm, RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import * as ProfileAPI from '../blizzard/interfaces/profile';
import { RaidExpansion } from '../blizzard/interfaces/profile/character-encounters/character-raids.interface';
import { EquippedItem } from '../blizzard/interfaces/profile/character-equipment/character-equipment-summary.interface';
import { RaiderIOCharacter } from '../raider.io/interfaces/raider-io-character.interface';
import { RoleType } from '../warcraftlogs/interfaces/role-type.enum';
import { ZoneRankings } from '../warcraftlogs/interfaces/zone-rankings.interface';
import { Covenant } from './enums/covenant.enum';
import { CharacterMedia } from './interfaces/character-media.interface';
import { CharacterRankings } from './interfaces/character-rankings.interface';

@Unique({ properties: ['name', 'realm', 'region'] })
@Entity({ abstract: true })
export abstract class Character extends BaseEntity<Character, 'id'> {
  private findCharacterDTO: FindCharacterDto;

  constructor(name: string, realm: Realm, region: Region) {
    super();
    this.name = name;
    this.realm = realm;
    this.region = region;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Enum(() => Region)
  region!: Region;

  @Enum(() => RealmSlug)
  realm!: Realm;

  /**
   * Profile Summary
   */

  @Property({ type: 'smallint', nullable: true })
  level?: number;

  @Property({ type: 'smallint', nullable: true })
  race_id?: number;

  @Property({ nullable: true })
  race_name?: string;

  @ManyToOne(() => PlayableClass, { eager: true })
  class!: PlayableClass;

  @ManyToOne(() => PlayableSpecialization, { eager: true, nullable: true })
  specialization?: PlayableSpecialization;

  @Property({ nullable: true })
  gender?: string;

  @Property({ nullable: true })
  average_item_level?: number;

  @Property({ nullable: true })
  equipped_item_level?: number;

  @Enum({ items: () => Covenant, nullable: true })
  covenant?: Covenant;

  @Property({ type: 'smallint', nullable: true })
  renown?: number;

  @Property({ nullable: true })
  last_login?: Date;

  // They use a non-standard date format, hence the string.
  @Property({ nullable: true })
  last_modified?: string;

  /**
   * Profile Media Summary
   */
  @Property({ nullable: true })
  media?: CharacterMedia;

  /**
   * Profile Specializations
   */

  // @ManyToOne(() => PlayableSpecialization, { eager: true })
  // specializations?: SpecializationMeta[];

  /**
   * Profile Raids
   */

  @Property({ nullable: true, type: 'jsonb' })
  raids?: RaidExpansion[];

  /**
   * Profile Equipment
   */

  @Property({ nullable: true, type: 'jsonb' })
  equipment?: EquippedItem[];

  /**
   * Profile Mounts Collection
   */

  @Property({ type: 'smallint', nullable: true })
  num_mounts_collected?: number;

  /**
   * Profile Titles
   */
  @Property({ nullable: true })
  title?: string;

  /**
   * RaiderIO
   */

  @Property({ nullable: true })
  raiderIO?: RaiderIOCharacter;

  @Property({ nullable: true })
  rankings?: CharacterRankings;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  setCharacterProfileSummary(
    data: ProfileAPI.CharacterProfileSummary,
    em: EntityManager,
  ) {
    if (!this.id) this.id = data.id;

    this.name = data.name;
    this.level = data.level;
    this.race_id = data.race.id;
    this.race_name = data.race.name;
    this.class = em.getReference(PlayableClass, data.character_class.id);
    this.gender = data.gender.name;
    this.average_item_level = data.average_item_level;
    this.equipped_item_level = data.equipped_item_level;
    this.last_login = new Date(data.last_login_timestamp);

    if (data.covenant_progress) {
      this.covenant = data.covenant_progress.chosen_covenant.name;
      this.renown = data.covenant_progress.renown_level;
    }

    if (data.active_title) {
      this.title = data.active_title.display_string;
    }
  }

  setCharacterMediaSummary(data: ProfileAPI.CharacterMediaSummary) {
    if (!data.assets) return;

    if (!this.media) {
      this.media = {
        avatar: '',
        inset: '',
        main: '',
        'main-raw': '',
      };
    }

    for (const asset of data.assets) {
      this.media[asset.key] = asset.value;
    }
  }

  setCharacterSpecializationsSummary(
    data: ProfileAPI.CharacterSpecializationsSummary,
    em: EntityManager,
  ) {
    // Characters without a selected spec have no useful data.
    if (data.active_specialization) {
      this.specialization = em.getReference(
        PlayableSpecialization,
        data.active_specialization.id,
      );
    }
  }

  setCharacterRaidEncounterSummary(data: ProfileAPI.CharacterRaids) {
    // A character that has no raid kills can apparently lack this object.
    if (data.expansions) {
      this.raids = data.expansions.slice(-2);
    }
  }

  setCharacterEquipmentSummary(data: ProfileAPI.CharacterEquipmentSummary) {
    this.equipment = data.equipped_items;
  }

  setCharacterMountsCollectionSummary(
    data: ProfileAPI.CharacterMountsCollectionSummary,
  ) {
    this.num_mounts_collected = data.mounts.length;
  }

  setCharacterTitle(data: ProfileAPI.CharacterTitlesSummary) {
    this.title = data?.active_title?.display_string;
  }

  setCharacterRaiderIO(data: RaiderIOCharacter) {
    this.raiderIO = data;
  }

  setCharacterRankings(role: RoleType, data: ZoneRankings) {
    this.rankings = this.rankings || {};
    this.rankings[role] = data;
  }

  /**
   * DTO Methods
   */

  getFindCharacterDTO() {
    if (!this.findCharacterDTO) {
      this.findCharacterDTO = new FindCharacterDto(
        this.name,
        this.realm,
        this.region,
      );
    }

    return this.findCharacterDTO;
  }
}
