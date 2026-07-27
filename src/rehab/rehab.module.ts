import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GrpcModule } from 'src/transports/grpc.module';
import { RehabController } from './rehab.controller';

@Module({
  imports: [GrpcModule, AuthModule],
  controllers: [RehabController],
})
export class RehabModule {}
