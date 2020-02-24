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

<<<<<<< HEAD
  @Column()
=======
  @Column({ nullable: true })
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  name: string;

  @Column({ unique: true })
  slug: string;

<<<<<<< HEAD
  @Column({ type: 'enum', enum: Expansion })
  expansion: Expansion;

  @Column()
=======
  @Column({ type: 'enum', enum: Expansion, nullable: true })
  expansion: Expansion;

  @Column({ nullable: true })
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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

<<<<<<< HEAD
=======
  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  locked: boolean;

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  @UpdateDateColumn()
  updatedAt: Date;
}
