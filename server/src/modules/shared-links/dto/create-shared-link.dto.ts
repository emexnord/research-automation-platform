import { IsUUID, IsIn, IsOptional, IsString, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSharedLinkDto {
  @ApiProperty({ example: 'b1a7c8e2-1234-4f56-9abc-1234567890ab', description: 'The UUID of the file or folder to share.' })
  @IsUUID()
  item_id: string;

  @ApiProperty({ example: 'file', description: 'Type of item to share (file or folder).' })
  @IsIn(['file', 'folder'])
  item_type: 'file' | 'folder';

  @ApiProperty({ example: 'viewer', description: 'Permission type for the shared link.' })
  @IsIn(['viewer', 'editor', 'owner'])
  permission_type: 'viewer' | 'editor' | 'owner';

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59.000Z', description: 'Optional expiry date for the shared link.' })
  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @ApiPropertyOptional({ example: 'secret123', description: 'Optional password for the shared link.' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'recipient@example.com', description: 'Email address to send the shared link to.' })
  @IsEmail()
  recipient_email: string;
} 