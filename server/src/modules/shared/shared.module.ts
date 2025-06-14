import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/token.entity';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [TokenService, EmailService],
  exports: [TokenService, EmailService],
})
export class SharedModule {}
