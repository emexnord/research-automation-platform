import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Files } from '../db/entities/files.entity';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
  ) {}

  async uploadFile(file: Express.Multer.File, user: any) {
    const now = new Date();
    const fileEntity = this.filesRepository.create({
      user_id: user.id,
      filename: file.originalname,
      file_type: file.mimetype,
      file_size: file.size,
      storage_key: file.path,
      upload_date: now,
      last_modified: now,
      parent_folder_id: null,
    });
    await this.filesRepository.save(fileEntity);
    return { message: 'File uploaded successfully', file: fileEntity };
  }

  async downloadFile(id: string, withEntity = false): Promise<{ file: StreamableFile, fileEntity: Files }> {
    const fileEntity = await this.filesRepository.findOne({ where: { file_id: id } });
    if (!fileEntity) throw new NotFoundException('File not found');
    const fileStream = createReadStream(join(process.cwd(), fileEntity.storage_key));
    const file = new StreamableFile(fileStream);
    return { file, fileEntity };
  }

  async listFiles(user: any, parent_folder_id?: string) {
    const where: any = { user_id: user.id };
    if (parent_folder_id) where.parent_folder_id = parent_folder_id;
    return this.filesRepository.find({ where });
  }

  async softDeleteFile(id: string, user: any) {
    const file = await this.filesRepository.findOne({ where: { file_id: id, user_id: user.id } });
    if (!file) throw new NotFoundException('File not found or not owned by user');
    await this.filesRepository.softDelete(id);
    return { message: 'File soft deleted' };
  }

  async hardDeleteFile(id: string, user: any) {
    const file = await this.filesRepository.findOne({ where: { file_id: id, user_id: user.id }, withDeleted: true });
    if (!file) throw new NotFoundException('File not found or not owned by user');
    await this.filesRepository.delete(id);
    return { message: 'File permanently deleted' };
  }

  async restoreFile(id: string, user: any) {
    const file = await this.filesRepository.findOne({ where: { file_id: id, user_id: user.id }, withDeleted: true });
    if (!file) throw new NotFoundException('File not found or not owned by user');
    await this.filesRepository.restore(id);
    return { message: 'File restored' };
  }

  async shareFile(id: string, user: any, body: any) {
    // Validate permissions, implement sharing logic (stub)
    // Example: body = { shared_with_user_id, permission_type }
    if (!body.shared_with_user_id || !body.permission_type) {
      throw new Error('Missing sharing parameters');
    }
    // ... Insert into FileFolderShares table (not implemented here)
    return { message: 'File shared (stub)', details: body };
  }

  // Add access control helpers as needed
} 