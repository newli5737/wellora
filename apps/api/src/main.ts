import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Fail-fast validation of required env vars
  const dbUrl = configService.get<string>('DATABASE_URL');
  const jwtSecret = configService.get<string>('JWT_SECRET');

  if (!dbUrl) {
    logger.error('CRITICAL: DATABASE_URL is missing. Aborting startup.');
    process.exit(1);
  }
  if (!jwtSecret || jwtSecret.length < 32) {
    logger.error('CRITICAL: JWT_SECRET is missing or shorter than 32 chars. Aborting startup.');
    process.exit(1);
  }

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // Global validation pipe: whitelist, forbid non-whitelisted, transform payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter and logging
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS allowlist
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });

  // OpenAPI (Swagger) documentation
  const config = new DocumentBuilder()
    .setTitle('Wellora Healthcare API')
    .setDescription('Tài liệu API hệ thống đặt lịch và quản trị phòng khám Wellora')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  logger.log(`Wellora API service is running on http://localhost:${port}/api/v1`);
  logger.log(`OpenAPI documentation is available on http://localhost:${port}/api/docs`);
}

bootstrap();

