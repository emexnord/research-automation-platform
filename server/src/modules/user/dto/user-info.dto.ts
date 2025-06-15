import { IsEnum, IsOptional } from 'class-validator';
import { Occupation, Industry, YearsOfExperience } from '../entities/users_info.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiPropertyOptional({ enum: Occupation, example: Occupation.STUDENT })
  @IsOptional()
  @IsEnum(Occupation)
  occupation?: Occupation;

  @ApiPropertyOptional({ enum: Industry, example: Industry.SOFTWARE })
  @IsOptional()
  @IsEnum(Industry)
  industry?: Industry;

  @ApiPropertyOptional({ enum: YearsOfExperience, example: YearsOfExperience.ONE })
  @IsOptional()
  @IsEnum(YearsOfExperience)
  years_of_experience?: YearsOfExperience;
} 