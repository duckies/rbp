import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('article')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false })
  subtitle: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: true })
  header: string;

  @ManyToOne(type => User, user => user.articles, { eager: true, onDelete: 'SET NULL' })
  author: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
