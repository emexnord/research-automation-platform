import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';

/**
 * Represents the authentication token response.
 * Contains the access token required for authenticated API requests.
 */
export class RefreshTokenOutput {
  @IsString()
  accessToken!: string;
}

export class AuthTokenOutput {
  user!: Partial<User>;

  @IsString()
  accessToken!: string;
}
