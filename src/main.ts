import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';
import { spanishValidationExceptionFactory } from './common/helpers/spanish-validation-exception-factory';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Main');

  // Detrás de un único reverse proxy (nginx en el VPS) -> confía en el primer hop
  // de X-Forwarded-For para que req.ip sea la IP real del cliente, no la del proxy.
  // Sin esto, @nestjs/throttler usa req.ip como key y todos los usuarios comparten
  // el mismo contador de rate limit.
  app.set('trust proxy', 1);

  app.enableCors({
    origin: envs.corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: spanishValidationExceptionFactory,
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);
  logger.log(`Auth Service running on port ${envs.port}`);
}
void bootstrap();
