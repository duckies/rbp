import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export enum Expansion {
  BATTLE_FOR_AZEROTH = 'Battle for Azeroth',
  LEGION = 'Legion',
}

@Entity('raid')
export class Raid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: Expansion })
  expansion: Expansion;

  @Column()
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
  normalKilled: number;

  @Column()
  heroicKilled: number;

  @Column()
  mythicKilled: number;

  @Column({ default: false })
  isFeatured: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
