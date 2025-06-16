import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtMiddleware } from '../jwt/jwt.middleware';
import { JwtModule } from '../jwt/jwt.module';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { SharedModule } from '../shared/shared.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { UsersInfo } from './entities/users_info.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User, UsersInfo]),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, GoogleStrategy, JwtStrategy],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        '/user/login',
        '/user/register',
        '/user/forgot-password',
        '/user/reset-password',
        '/user/verify-email',
        '/user/verify-email/send',
        '/user/auth/google',
        '/user/auth/google/callback',
      )
      .forRoutes('/user');
  }
}
