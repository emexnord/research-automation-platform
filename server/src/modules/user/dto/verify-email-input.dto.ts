import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailInputDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
