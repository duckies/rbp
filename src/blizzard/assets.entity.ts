import { Entity, Enum, PrimaryKey, Property, Unique } from 'mikro-orm';
import { AssetType } from './enums/asset-type.enum';

@Entity({ tableName: 'wow_asset' })
@Unique({ properties: ['id', 'type'] })
export class WoWAsset {
  constructor(id: number, type: AssetType, value: string) {
    this.id = id;
    this.type = type;
    this.value = value;
  }

  @PrimaryKey()
  id!: number;

  @Enum(() => AssetType)
  type: AssetType;

  @Property()
  value!: string;
}
