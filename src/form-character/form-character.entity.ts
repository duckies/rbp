import { Entity, Enum, ManyToOne, PrimaryKey, Property, Unique } from 'mikro-orm';
import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import * as ProfileAPI from '../blizzard/interfaces/profile';
import { RaidExpansion } from '../blizzard/interfaces/profile/character-encounters/character-raids.interface';
import { EquippedItem } from '../blizzard/interfaces/profile/character-equipment/character-equipment-summary.interface';
import { SpecializationMeta } from '../blizzard/interfaces/profile/character-specializations/character-specializations-summary.interface';
import { FormSubmission } from '../form-submission/form-submission.entity';
import { RaiderIOCharacter } from '../raiderIO/interfaces/raider-io-character.interface';

@Entity()
@Unique({ name: 'unique_main', properties: ['id', 'name', 'realm', 'region', 'isMain'] })
export class FormCharacter {
  constructor(name: string, realm: RealmSlug = RealmSlug.Area52, region: Region = Region.US) {
    this.name = name;
    this.realm = realm;
    this.region = region;
  }

  @PrimaryKey()
  id!: number;

  @Property({ index: true })
  character_id?: number;

  @Property()
  name!: string;

  @Enum(() => RealmSlug)
  realm!: RealmSlug;

  @Enum(() => Region)
  region: Region = Region.US;

  @Property()
  isMain = false;

  @Property({ type: 'smallint' })
  race_id?: number;

  @Property()
  race_name?: string;

  @Property({ type: 'smallint' })
  class_id?: number;

  @Property()
  class_name?: string;

  @Property()
  gender?: string;

  @Property()
  average_item_level?: number;

  @Property()
  equipped_item_level?: number;

  /**
   * Optional Character Data Fields
   */

  @Property()
  avatar_url?: string;

  @Property()
  bust_url?: string;

  @Property()
  render_url?: string;

  @Property()
  raids?: RaidExpansion[];

  @Property()
  equipment?: EquippedItem[];

  @Property()
  specialization_id?: number;

  @Property()
  specialization_name?: string;

  @Property()
  specializations?: SpecializationMeta[];

  @Property()
  raiderIO?: RaiderIOCharacter;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  /**
   * Form Character Relations
   */

  @ManyToOne()
  submission?: FormSubmission;

  /**
   * Updating Methods
   */

  setCharacterProfileSummary(data: ProfileAPI.CharacterProfileSummary) {
    if (!this.character_id) {
      this.character_id = data.id;
    }

    this.name = data.name;
    this.race_id = data.race.id;
    this.race_name = data.race.name;
    this.class_id = data.character_class.id;
    this.class_name = data.character_class.name;
    this.gender = data.gender.name;
    this.average_item_level = data.average_item_level;
    this.equipped_item_level = data.equipped_item_level;
  }

  setCharacterSpecializationsSummary(data: ProfileAPI.CharacterSpecializationsSummary) {
    this.specialization_id = data.active_specialization.id;
    this.specialization_name = data.active_specialization.name;
    this.specializations = data.specializations;
  }

  setCharacterRaidEncounterSummary(data: ProfileAPI.CharacterRaids) {
    // A character that has no raid kills can apparently lack this object.
    if (data.expansions) {
      this.raids = data.expansions.slice(-2);
    }
  }

  setCharacterMediaSummary(data: ProfileAPI.CharacterMediaSummary) {
    this.avatar_url = data.avatar_url;
    this.bust_url = data.bust_url;
    this.render_url = data.render_url;
  }

  setCharacterEquipmentSummary(data: ProfileAPI.CharacterEquipmentSummary) {
    this.equipment = data.equipped_items;
  }

  setCharacterRaiderIO(data: RaiderIOCharacter) {
    this.raiderIO = data;
  }
}
