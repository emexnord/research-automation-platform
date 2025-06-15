import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

export enum Occupation {
  STUDENT = 'student',
  RESEARCHER = 'researcher',
  PROJECT_MANAGER = 'project_manager',
}

export enum Industry {
  SOFTWARE = 'software',
  ENGINEERING = 'engineering',
  HEALTH = 'health',
  SOCIAL_SECTOR = 'social_sector',
}

export enum YearsOfExperience {
  ONE = '1',
  TWO = '2',
  FIVE = '5',
  TEN = '10',
  TEN_PLUS = '10+',
}

@Entity('users_info')
@Unique(['email'])
export class UsersInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Occupation, nullable: true })
  occupation?: Occupation;

  @Column({ type: 'enum', enum: Industry, nullable: true })
  industry?: Industry;

  @Column({ type: 'enum', enum: YearsOfExperience, nullable: true })
  years_of_experience?: YearsOfExperience;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 