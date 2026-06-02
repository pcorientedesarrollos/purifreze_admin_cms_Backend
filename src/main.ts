import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { static as expressStatic } from 'express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: [process.env.LANDING_ORIGIN, process.env.ADMIN_ORIGIN].filter(
      (origin): origin is string => Boolean(origin),
    ),
    credentials: true,
  });
  app.use('/uploads', expressStatic(join(process.cwd(), 'uploads')));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
