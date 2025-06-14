import { Injectable } from '@nestjs/common';
import { FileFolderShares } from '../db/entities/file_folder_shares.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShareFolderDto } from './dto/share-folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FileFolderShares)
    private readonly sharesRepository: Repository<FileFolderShares>,
  ) {}

  // Dependency injection for repositories will go here

  async createFolder(/* params */) {
    // Handle folder creation
  }

  async listFolders(/* params */) {
    // List folders, optionally by parent/user
  }

  async softDeleteFolder(/* params */) {
    // Soft delete logic
  }

  async hardDeleteFolder(/* params */) {
    // Hard delete logic
  }

  async restoreFolder(/* params */) {
    // Restore soft-deleted folder
  }

  async shareFolder(id: string, user: any, body: ShareFolderDto) {
    if (body.shared_with_user_id === user.id) {
      throw new Error('Cannot share folder with yourself');
    }
    // Check folder ownership (implement actual check as needed)
    // ...
    // Upsert share
    let share = await this.sharesRepository.findOne({ where: { item_id: id, item_type: 'folder', shared_with_user_id: body.shared_with_user_id } });
    if (share) {
      // Update permission if different
      if (share.permission_type !== body.permission_type) {
        share.permission_type = body.permission_type;
        await this.sharesRepository.save(share);
        return { message: 'Share permission updated', share };
      } else {
        return { message: 'Share already exists with same permission', share };
      }
    } else {
      share = this.sharesRepository.create({
        item_id: id,
        item_type: 'folder',
        shared_with_user_id: body.shared_with_user_id,
        permission_type: body.permission_type,
      });
      await this.sharesRepository.save(share);
      return { message: 'Folder shared', share };
    }
  }

  async moveFolder(/* params */) {
    // Move folder logic
  }

  // Add access control helpers as needed
} 