import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserToTeamDto {
  @ApiProperty({ example: 'user-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
