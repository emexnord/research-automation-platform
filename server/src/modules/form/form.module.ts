import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
