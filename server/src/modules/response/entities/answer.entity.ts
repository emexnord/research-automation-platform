import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Response } from './response.entity';

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => Response, (response) => response.id)
  responseId: string;

  @Column()
  questionId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
