import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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
