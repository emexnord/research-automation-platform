import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('file_folder_shares')
export class FileFolderShares {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  item_id: string;

  @Column({ length: 10 })
  item_type: string; // 'file' or 'folder'

  @Column('uuid')
  shared_with_user_id: string;

  @Column({ length: 20 })
  permission_type: string; // 'viewer', 'editor', 'owner'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 