import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'Updated Team Name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Updated description about the team',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
