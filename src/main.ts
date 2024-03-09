import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: errors.reduce(
            (acc, e) => ({
              ...acc,
              [e.property]: Object.values(e.constraints),
            }),
            {},
          ),
        });
      },
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
