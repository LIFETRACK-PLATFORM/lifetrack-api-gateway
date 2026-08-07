import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GrpcModule } from 'src/transports/grpc.module';
import { VaultController } from './vault.controller';

@Module({
  imports: [GrpcModule, AuthModule],
  controllers: [VaultController],
})
export class VaultModule {}
