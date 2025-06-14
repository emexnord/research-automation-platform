import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Answer } from './answer.entity';

@Entity('response')
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  formId: string;

  @OneToMany(() => Answer, (answer) => answer.responseId, {
    cascade: true,
  })
  answers: Answer[];

  @Column({ type: 'text', nullable: true })
  userEmail?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
