import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/db/database.module';
import configuration from './config';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { FilesModule } from './modules/files/files.module';
import { FoldersModule } from './modules/folders/folders.module';
import { SharedLinksModule } from './modules/shared-links/shared-links.module';

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
    FilesModule,
    FoldersModule,
    SharedLinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
