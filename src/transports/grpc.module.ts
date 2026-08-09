import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { envs } from 'src/config/envs';

const contractsProtoPath = (file: string) =>
  join(
    dirname(require.resolve('@lifetrack/contracts/package.json')),
    'proto',
    file,
  );

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'lifetrack.auth',
          protoPath: contractsProtoPath('auth.proto'),
          url: envs.authGrpcUrl,
          loader: { arrays: true, defaults: true },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'lifetrack.user',
          protoPath: contractsProtoPath('user.proto'),
          url: envs.userGrpcUrl,
          loader: { arrays: true, defaults: true },
        },
      },
      {
        name: 'REHAB_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'lifetrack.rehab',
          protoPath: contractsProtoPath('rehab.proto'),
          url: envs.rehabGrpcUrl,
          loader: { arrays: true, defaults: true },
        },
      },
      {
        name: 'FINANCE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'lifetrack.finance',
          protoPath: contractsProtoPath('finance.proto'),
          url: envs.financeGrpcUrl,
          loader: { arrays: true, defaults: true },
        },
      },
      {
        name: 'VAULT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'lifetrack.vault',
          protoPath: contractsProtoPath('vault.proto'),
          url: envs.vaultGrpcUrl,
          loader: { arrays: true, defaults: true },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
