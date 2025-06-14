import { Controller, Post, Get, Delete, Patch, Param, Body, UploadedFile, UseInterceptors, UseGuards, Res, Req, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { multerDiskConfig } from './multer.config';
import { ShareFileDto } from './dto/share-file.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @UseInterceptors(FileInterceptor('file', multerDiskConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const user = req.user;
    return this.filesService.uploadFile(file, user);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File downloaded.' })
  async downloadFile(@Param('id') id: string, @Res() res) {
    const { file, fileEntity } = await this.filesService.downloadFile(id, true);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileEntity.filename}"`,
    });
    file.getStream().pipe(res);
  }

  @Get()
  @ApiOperation({ summary: 'List files for the authenticated user' })
  @ApiQuery({ name: 'parent_folder_id', required: false, description: 'Filter by parent folder ID' })
  @ApiResponse({ status: 200, description: 'List of files.' })
  async listFiles(@Req() req) {
    const user = req.user;
    return this.filesService.listFiles(user, req.query.parent_folder_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File soft deleted.' })
  async softDeleteFile(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.filesService.softDeleteFile(id, user);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File permanently deleted.' })
  async hardDeleteFile(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.filesService.hardDeleteFile(id, user);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File restored.' })
  async restoreFile(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.filesService.restoreFile(id, user);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a file with another user' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiBody({ type: ShareFileDto, examples: {
    share: {
      summary: 'Share file with edit permission',
      value: {
        shared_with_user_id: 'b1a7c8e2-1234-4f56-9abc-1234567890ab',
        permission_type: 'editor',
      },
    },
  }})
  @ApiResponse({ status: 201, description: 'File shared.' })
  async shareFile(@Param('id') id: string, @Body(new ValidationPipe()) body: ShareFileDto, @Req() req) {
    const user = req.user;
    return this.filesService.shareFile(id, user, body);
  }
} 