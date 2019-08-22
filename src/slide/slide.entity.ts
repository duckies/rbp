import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity('slide')
export class Slide extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ nullable: true })
  link?: string;
}