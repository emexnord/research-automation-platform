import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from './response.service';
import { JwtMiddleware } from '../jwt/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('/response');
  }
}
