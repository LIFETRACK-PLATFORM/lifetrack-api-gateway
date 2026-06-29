import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { GrpcModule } from 'src/transports/grpc.module';

@Module({
  controllers: [AuthController,

  ],
  providers: [],
  imports: [NatsModule, GrpcModule],
})
export class AuthModule { }
