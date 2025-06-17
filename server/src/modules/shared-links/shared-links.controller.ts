import { Controller, Post, Delete, Param, Body, UseGuards, Req, Res, ValidationPipe } from '@nestjs/common';
import { SharedLinksService } from './shared-links.service';
import { CreateSharedLinkDto } from './dto/create-shared-link.dto';
import { AccessSharedLinkDto } from './dto/access-shared-link.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Shared Links')
@Controller('shared-links')
export class SharedLinksController {
  constructor(private readonly sharedLinksService: SharedLinksService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a shared link for a file or folder' })
  @ApiBody({
    type: CreateSharedLinkDto,
    examples: {
      file: {
        summary: 'Share a file with password and expiry',
        value: {
          item_id: 'b1a7c8e2-1234-4f56-9abc-1234567890ab',
          item_type: 'file',
          permission_type: 'viewer',
          expiry_date: '2024-12-31T23:59:59.000Z',
          password: 'secret123',
          recipient_email: 'recipient@example.com',
        },
      },
      folder: {
        summary: 'Share a folder without password',
        value: {
          item_id: 'c2b8d9f3-5678-4e12-8def-9876543210cd',
          item_type: 'folder',
          permission_type: 'editor',
          recipient_email: 'recipient@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Shared link created.' })
  @UseGuards(JwtAuthGuard)
  async createSharedLink(
    @Body(new ValidationPipe()) body: CreateSharedLinkDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.sharedLinksService.createSharedLink(body, user);
  }

  @Post(':linkId/access')
  @ApiOperation({ summary: 'Access a shared link (download file or folder)' })
  @ApiParam({ name: 'linkId', description: 'Shared Link ID' })
  @ApiBody({
    type: AccessSharedLinkDto,
    examples: {
      withPassword: {
        summary: 'Access with password',
        value: { password: 'secret123' },
      },
      noPassword: {
        summary: 'Access without password',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 200, description: 'File or folder downloaded.' })
  async accessSharedLink(
    @Param('linkId') linkId: string,
    @Body(new ValidationPipe()) body: AccessSharedLinkDto,
    @Res() res,
  ) {
    return this.sharedLinksService.accessSharedLink(linkId, body, res);
  }

  @Delete(':linkId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke (delete) a shared link' })
  @ApiParam({ name: 'linkId', description: 'Shared Link ID' })
  @ApiResponse({ status: 200, description: 'Shared link revoked.' })
  @UseGuards(JwtAuthGuard)
  async revokeSharedLink(@Param('linkId') linkId: string, @Req() req) {
    const user = req.user;
    return this.sharedLinksService.revokeSharedLink(linkId, user);
  }
} 