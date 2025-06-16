import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config';

const config = configuration();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      entities: [],
      synchronize: process.env.NODE_ENV === 'development',
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
