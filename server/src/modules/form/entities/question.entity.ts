import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionType } from './question.type';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  formId: string;

  @Column()
  question: string;

  @Column()
  type: QuestionType;

  @Column({ type: 'jsonb' }) // Required for MULTIPLE_CHOICE, CHECKBOXES, and DROPDOWN
  options?: string[];

  @Column()
  isRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
