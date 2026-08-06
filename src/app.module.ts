import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { RehabModule } from './rehab/rehab.module';
import { UsersModule } from './users/users.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60_000,
          limit: 100,
        },
        {
          // Ventana larga para detectar abuso sostenido (bajo volumen por minuto
          // pero repetido durante mucho tiempo). Permisiva por defecto: los
          // endpoints sensibles de auth la restringen vía @Throttle({ long: ... }).
          name: 'long',
          ttl: 15 * 60_000,
          limit: 1000,
        },
      ],
      errorMessage:
        'Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde.',
    }),
    AuthModule,
    UsersModule,
    RehabModule,
    NatsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
