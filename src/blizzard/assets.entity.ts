import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

export enum AssetType {
    Icon = 'icon',
    Spell = 'spell'
}

@Entity('wow_assets')
@Unique('unique_asset_id_type', ['id', 'type'])
export class WoWAssets extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @PrimaryColumn({type: "enum", enum: AssetType })
  type: AssetType

  @Column()
  value: string;
}