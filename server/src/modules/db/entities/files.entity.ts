import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn('uuid')
  file_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 100 })
  file_type: string;

  @Column('bigint')
  file_size: number;

  @Column({ length: 255 })
  storage_key: string;

  @Column({ type: 'timestamp' })
  upload_date: Date;

  @Column({ type: 'timestamp' })
  last_modified: Date;

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