import { IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareFolderDto {
  @ApiProperty({ example: 'b1a7c8e2-1234-4f56-9abc-1234567890ab', description: 'The UUID of the user to share the folder with.' })
  @IsUUID()
  shared_with_user_id: string;

  @ApiProperty({ example: 'viewer', description: 'Permission type for the shared folder.' })
  @IsIn(['viewer', 'editor', 'owner'])
  permission_type: 'viewer' | 'editor' | 'owner';
} 