import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { JwtMiddleware } from '../jwt/jwt.middleware';
import { GeminiService } from './ai.service';
import { Form } from './entities/form.entity';
import { Question } from './entities/question.entity';
import { FormController } from './form.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Question])],
  providers: [FormService, GeminiService],
  controllers: [FormController],
  exports: [FormService],
})
export class FormModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('/form');
  }
}
