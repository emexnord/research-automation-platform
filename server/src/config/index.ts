import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

// Define and validate environment variables schema
const configSchema = z.object({
  // General settings
  PORT: z.string().regex(/^\d+$/).transform(Number).default('8080'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERSION: z.string().optional().default('1.0'),

  // client settings
  CLIENT_URL: z.string().default('http://localhost:3000'),
  CLIENT_RESET_PASSWORD_URL: z
    .string()
    .default('http://localhost:3000/reset-password'),

  // JWT Configuration
  JWT_ACCESS_TOKEN_SECRET: z.string().optional().default(''),
  JWT_REFRESH_TOKEN_SECRET: z.string().optional().default(''),
  JWT_ALGORITHMS: z.string().optional().default('RS256'),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().optional().default('7d'),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().optional().default('7d'),

  // MySQL settings
  POSTGRES_URL: z.string().default(''),

  // Google settings
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_REDIRECT_URL: z.string().optional().default(''),
  GOOGLE_CALLBACK_URL: z.string().optional().default(''),

  // Database configuration
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

// Parse and validate environment variables
const config = configSchema.parse(process.env);

// Configuration object
const configuration = () => ({
  app: {
    port: config.PORT,
    environment: config.NODE_ENV,
    version: config.VERSION,
  },
  client: {
    url: config.CLIENT_URL,
    resetPasswordUrl: config.CLIENT_RESET_PASSWORD_URL,
  },
  google: {
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackUrl: config.GOOGLE_CALLBACK_URL,
    redirectUrl: config.GOOGLE_REDIRECT_URL,
  },
  db: {
    url: config.POSTGRES_URL,
    autoLoadEntities: config.NODE_ENV === 'development',
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT || '5432', 10),
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  },
  jwt: {
    accessTokenSecret: config.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: config.JWT_REFRESH_TOKEN_SECRET,
    accessAlgorithms: config.JWT_ALGORITHMS,
    accessTokenExpiry: config.JWT_ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: config.JWT_REFRESH_TOKEN_EXPIRY,
  },
});

export type Config = ReturnType<typeof configuration>;
export default configuration;
