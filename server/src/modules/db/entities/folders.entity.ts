import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('folders')
export class Folders {
  @PrimaryGeneratedColumn('uuid')
  folder_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ length: 255 })
  folder_name: string;

  @Column('uuid', { nullable: true })
  parent_folder_id: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
} 