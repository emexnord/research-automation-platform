import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AccessSharedLinkDto {
  @ApiPropertyOptional({ example: 'secret123', description: 'Password for accessing the shared link, if required.' })
  @IsOptional()
  @IsString()
  password?: string;
} 