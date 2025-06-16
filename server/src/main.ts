import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown props are sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // 👈 allow cookies (if using withCredentials)
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Research Automation Platform API')
    .setDescription('API documentation for file, folder, and sharing endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true, // Allow all origins
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
