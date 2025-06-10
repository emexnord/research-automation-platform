import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLE } from './user.interface';
import { AuthProviderInfo } from './provider.entity'; // You'll need to adapt this too

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  salt: string;

  @Column({ default: '' })
  image: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  authProviders: AuthProviderInfo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
