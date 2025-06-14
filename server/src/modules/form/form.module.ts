import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { JwtMiddleware } from '../jwt/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('/form');
  }
}
