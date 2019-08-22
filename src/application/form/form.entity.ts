import { PrimaryGeneratedColumn, Column, BaseEntity, Entity } from 'typeorm';

@Entity('form')
export class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  fields: any;
}
