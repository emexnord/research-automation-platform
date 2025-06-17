import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Team } from '../../team/entities/team.entity';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  TODO = 'todo',
  PROGRESS = 'progress',
  REVIEW = 'review',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  taskId: string;

  @Column({ nullable: true })
  assigneeId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User;

  @Column('jsonb', { default: [] })
  labels: Array<{
    name: string;
    color: string;
    textColor: string;
  }>;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column()
  teamId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'float', nullable: true })
  estimatedHours?: number;

  @Column({ type: 'float', default: 0 })
  actualHours: number;

  @Column('jsonb', { default: [] })
  assignmentHistory: Array<{
    assigneeId: string | null;
    assignedBy: string;
    assignedAt: Date;
    action: 'assigned' | 'unassigned' | 'reassigned';
  }>;

  @Column('jsonb', { default: [] })
  activity: Array<{
    id: string;
    type: 'created' | 'updated' | 'assigned' | 'commented' | 'moved' | 'completed';
    description: string;
    userId: string;
    createdAt: Date;
    metadata?: any;
  }>;

  @ManyToMany(() => Task)
  @JoinTable({
    name: 'related_tasks',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'related_task_id', referencedColumnName: 'id' },
  })
  relatedTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 