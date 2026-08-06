import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GrpcModule } from 'src/transports/grpc.module';
import { FinanceController } from './finance.controller';

@Module({
  imports: [GrpcModule, AuthModule],
  controllers: [FinanceController],
})
export class FinanceModule {}
