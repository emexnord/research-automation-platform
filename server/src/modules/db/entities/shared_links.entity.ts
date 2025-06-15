import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('shared_links')
export class SharedLinks {
  @PrimaryGeneratedColumn('uuid')
  link_id: string;

  @Column('uuid')
  item_id: string;

  @Column({ length: 10 })
  item_type: string; // 'file' or 'folder'

  @Column('uuid')
  shared_by_user_id: string;

  @Column({ type: 'timestamp' })
  share_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiry_date: Date | null;

  @Column({ length: 20 })
  permission_type: string; // 'viewer', 'editor', 'owner'

  @Column({ default: false })
  password_protected: boolean;

  @Column({ type: 'text', nullable: true })
  password_hash: string | null;
} 