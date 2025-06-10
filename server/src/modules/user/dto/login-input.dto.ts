import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  handle!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
