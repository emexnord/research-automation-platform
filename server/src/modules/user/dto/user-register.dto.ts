import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterInputDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
