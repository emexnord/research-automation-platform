import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsObject,
} from 'class-validator';
import { AuthProvider, ROLE } from '../entities/user.interface';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(ROLE)
  @IsString()
  role?: ROLE;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  salt?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  authProviders?: { provider: AuthProvider; providerId: string }[];
}
