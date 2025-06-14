import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { QuestionType } from './question.type';
import { Form } from './form.entity';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => Form, (form) => form.id)
  formId: string;

  @Column()
  content: string;

  @Column()
  type: QuestionType;

  @Column({ type: 'jsonb', nullable: true }) // Required for MULTIPLE_CHOICE, CHECKBOXES, and DROPDOWN
  options?: string[] | null;

  @Column()
  isRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
