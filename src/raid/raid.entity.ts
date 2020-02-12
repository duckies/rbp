import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export enum Expansion {
  SHADOWLANDS = 'Shadowlands',
  BATTLE_FOR_AZEROTH = 'Battle for Azeroth',
  LEGION = 'Legion',
}

@Entity('raid')
export class Raid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: Expansion, nullable: true })
  expansion: Expansion;

  @Column({ nullable: true })
  background: string;

  @Column({ type: 'decimal' })
  progress: number;

  @Column()
  difficulty: string;

  @Column()
  world: number;

  @Column()
  region: number;

  @Column()
  realm: number;

  @Column()
  summary: string;

  @Column()
  bosses: number;

  @Column()
  normal_bosses_killed: number;

  @Column()
  heroic_bosses_killed: number;

  @Column()
  mythic_bosses_killed: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  locked: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
