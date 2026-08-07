import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { spanishValidationExceptionFactory } from './common/helpers/spanish-validation-exception-factory';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Main');

  // Detrás de un único reverse proxy (nginx en el VPS) -> confía en el primer hop
  // de X-Forwarded-For para que req.ip sea la IP real del cliente, no la del proxy.
  // Sin esto, @nestjs/throttler usa req.ip como key y todos los usuarios comparten
  // el mismo contador de rate limit.
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      hsts: { maxAge: 31_536_000, includeSubDomains: true },
      frameguard: { action: 'deny' },
    }),
  );

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

  // Nest invierte el orden de los global filters al resolverlos por request
  // (RouterExceptionFilters.create hace filters.reverse() antes del .find()),
  // así que el filtro catch-all (@Catch() sin args) tiene que registrarse
  // PRIMERO para terminar último en la búsqueda — si no, gana siempre él y
  // RpcCustomExceptionFilter nunca se ejecuta (todo cae como 500 genérico).
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new RpcCustomExceptionFilter(),
  );

  await app.listen(envs.port);
  logger.log(`Auth Service running on port ${envs.port}`);
}
void bootstrap();
