import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Question } from '../../../modules/form/entities/question.entity';

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  owner: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  context?: string;

  @OneToMany(() => Question, (question) => question.formId, { cascade: true })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
