import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from './response.service';
import { JwtMiddleware } from '../jwt/jwt.middleware';
import { Answer } from './entities/answer.entity';
import { Response } from './entities/response.entity';
import { ResponseController } from './response.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Response, Answer])],
  providers: [ResponseService],
  controllers: [ResponseController],
  exports: [ResponseService],
})
export class ResponseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(JwtMiddleware).forRoutes('/response');
  }
}
