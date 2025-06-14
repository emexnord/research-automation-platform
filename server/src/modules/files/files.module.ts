import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Files } from '../db/entities/files.entity';
import { FileFolderShares } from '../db/entities/file_folder_shares.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Files, FileFolderShares])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {} 