import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedLinksController } from './shared-links.controller';
import { SharedLinksService } from './shared-links.service';
import { SharedLinks } from '../db/entities/shared_links.entity';
import { Files } from '../db/entities/files.entity';
import { EmailService } from '../shared/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([SharedLinks, Files])],
  controllers: [SharedLinksController],
  providers: [SharedLinksService, EmailService],
  exports: [SharedLinksService],
})
export class SharedLinksModule {} 