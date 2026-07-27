import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcAuthGuard } from './guards/grpc-auth.guard';
import { SessionOrBearerGuard } from './guards/session-or-bearer.guard';
import { NatsModule } from 'src/transports/nats.module';
import { GrpcModule } from 'src/transports/grpc.module';

@Module({
  controllers: [AuthController],
  providers: [GrpcAuthGuard, SessionOrBearerGuard],
  imports: [NatsModule, GrpcModule],
  exports: [GrpcAuthGuard, SessionOrBearerGuard],
})
export class AuthModule {}
