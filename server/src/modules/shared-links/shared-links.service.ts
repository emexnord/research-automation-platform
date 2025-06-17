import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateSharedLinkDto } from './dto/create-shared-link.dto';
import { AccessSharedLinkDto } from './dto/access-shared-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedLinks } from '../db/entities/shared_links.entity';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../shared/email.service';
import { Files } from '../db/entities/files.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { StreamableFile } from '@nestjs/common';

@Injectable()
export class SharedLinksService {
  constructor(
    @InjectRepository(SharedLinks)
    private readonly sharedLinksRepository: Repository<SharedLinks>,
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    private readonly emailService: EmailService,
  ) {}

  async createSharedLink(body: CreateSharedLinkDto, user: any) {
    // 1. Validate item exists and user has permission
    let password_hash: string | null = null;
    if (body.password) {
      password_hash = await bcrypt.hash(body.password, 10);
    }
    const link = this.sharedLinksRepository.create({
      item_id: body.item_id,
      item_type: body.item_type,
      shared_by_user_id: user.id,
      share_date: new Date(),
      expiry_date: body.expiry_date ? new Date(body.expiry_date) : null,
      permission_type: body.permission_type,
      password_protected: !!body.password,
      password_hash,
    });
    await this.sharedLinksRepository.save(link);
    // Send email (assume body has recipient_email)
    if ((body as any).recipient_email) {
      const linkUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/shared-links/${link.link_id}/access`;
      await this.emailService.sendSharedLinkEmail((body as any).recipient_email, linkUrl, body.password);
    }
    return { message: 'Shared link created', link_id: link.link_id };
  }

  async accessSharedLink(linkId: string, body: AccessSharedLinkDto, res: any) {
    // 1. Find shared link by linkId
    const link = await this.sharedLinksRepository.findOne({ where: { link_id: linkId } });
    if (!link) throw new NotFoundException('Shared link not found');
    // 2. Check expiry
    if (link.expiry_date && new Date() > link.expiry_date) {
      throw new ForbiddenException('Shared link has expired');
    }
    // 3. If password protected, verify password
    if (link.password_protected) {
      if (!body.password) throw new BadRequestException('Password required');
      const valid = await bcrypt.compare(body.password, link.password_hash);
      if (!valid) throw new ForbiddenException('Invalid password');
    }
    // 4. Stream file as download (only for files)
    if (link.item_type === 'file') {
      const fileEntity = await this.filesRepository.findOne({ where: { file_id: link.item_id } });
      if (!fileEntity) throw new NotFoundException('File not found');
      const filePath = join(process.cwd(), fileEntity.storage_key); // Resolve the file path
      if (!filePath) throw new NotFoundException('File path not found');
    
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileEntity.filename}"`,
      });
    
      return res.sendFile(filePath); 
    } else {
      return res.status(501).json({ error: 'Folder sharing not implemented yet' });
    }
  }

  async revokeSharedLink(linkId: string, user: any) {
    // 1. Find shared link and check ownership
    // 2. Delete shared link
    return { message: 'Shared link revoked (stub)' };
  }
} 