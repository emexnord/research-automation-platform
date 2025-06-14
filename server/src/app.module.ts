import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/db/database.module';
import configuration from './config';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { FormModule } from './modules/form/form.module';
import { ResponseModule } from './modules/response/response.module';

const config = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    JwtModule,
    FormModule,
    ResponseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
