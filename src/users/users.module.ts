import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GrpcModule } from 'src/transports/grpc.module';
import { UsersController } from './users.controller';

@Module({
  imports: [GrpcModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
