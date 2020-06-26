import { Entity, Property } from 'mikro-orm';
import { Character } from './character.base.entity';

@Entity()
export class GuildCharacter extends Character {
  @Property({ type: 'smallint' })
  guild_rank!: number;
}
