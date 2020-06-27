import { Entity, PrimaryKey, Property, WrappedEntity } from '@mikro-orm/core';

@Entity()
export class DiscordConfig {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'json' })
  options: any;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DiscordConfig extends WrappedEntity<DiscordConfig, 'id'> {}
