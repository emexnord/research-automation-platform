import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'AI Research Team' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Team focused on collaborative AI research',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
