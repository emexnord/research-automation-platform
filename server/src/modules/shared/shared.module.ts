import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [TokenService],
  exports: [TokenService],
})
export class SharedModule {}
