import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthProvider } from './user.interface';

@Entity()
export class AuthProviderInfo {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    nullable: false,
  })
  provider: AuthProvider;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  providerId: string;
}
