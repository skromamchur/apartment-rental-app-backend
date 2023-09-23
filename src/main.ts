import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {UnprocessableEntityException, ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
