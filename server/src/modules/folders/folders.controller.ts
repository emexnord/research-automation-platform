import { Controller, Post, Get, Delete, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ShareFolderDto } from './dto/share-folder.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Folders')
@ApiBearerAuth()
@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a folder' })
  @ApiBody({ description: 'Folder creation data', type: Object })
  @ApiResponse({ status: 201, description: 'Folder created.' })
  async createFolder(@Body() body, @Req() req) {
    return this.foldersService.createFolder(/* params */);
  }

  @Get()
  @ApiOperation({ summary: 'List folders for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of folders.' })
  async listFolders(@Req() req) {
    return this.foldersService.listFolders(/* params */);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiResponse({ status: 200, description: 'Folder soft deleted.' })
  async softDeleteFolder(@Param('id') id: string, @Req() req) {
    return this.foldersService.softDeleteFolder(/* params */);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiResponse({ status: 200, description: 'Folder permanently deleted.' })
  async hardDeleteFolder(@Param('id') id: string, @Req() req) {
    return this.foldersService.hardDeleteFolder(/* params */);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiResponse({ status: 200, description: 'Folder restored.' })
  async restoreFolder(@Param('id') id: string, @Req() req) {
    return this.foldersService.restoreFolder(/* params */);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a folder with another user' })
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiBody({ type: ShareFolderDto, examples: {
    share: {
      summary: 'Share folder with view permission',
      value: {
        shared_with_user_id: 'b1a7c8e2-1234-4f56-9abc-1234567890ab',
        permission_type: 'viewer',
      },
    },
  }})
  @ApiResponse({ status: 201, description: 'Folder shared.' })
  async shareFolder(@Param('id') id: string, @Body(new ValidationPipe()) body: ShareFolderDto, @Req() req) {
    const user = req.user;
    return this.foldersService.shareFolder(id, user, body);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move a folder' })
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiBody({ description: 'Move folder data', type: Object })
  @ApiResponse({ status: 200, description: 'Folder moved.' })
  async moveFolder(@Param('id') id: string, @Body() body, @Req() req) {
    return this.foldersService.moveFolder(/* params */);
  }
} 