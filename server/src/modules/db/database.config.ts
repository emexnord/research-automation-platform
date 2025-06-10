import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Config } from '../../config';

export const getDatabaseConfig = (config: Config): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.db.url,
  autoLoadEntities: config.db.autoLoadEntities,
  synchronize: config.app.environment === 'development', // Only enable in development
  ssl:
    config.app.environment === 'production'
      ? { rejectUnauthorized: false }
      : false,
  logging: config.app.environment === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
