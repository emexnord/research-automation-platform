import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from './response.service';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
