import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { Folders } from '../db/entities/folders.entity';
import { FileFolderShares } from '../db/entities/file_folder_shares.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folders, FileFolderShares])],
  controllers: [FoldersController],
  providers: [FoldersService],
  exports: [FoldersService],
})
export class FoldersModule {} 