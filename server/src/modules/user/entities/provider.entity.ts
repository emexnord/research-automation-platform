import { Column, Entity } from 'typeorm';
import { AuthProvider } from './user.interface';

@Entity()
export class AuthProviderInfo {
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
