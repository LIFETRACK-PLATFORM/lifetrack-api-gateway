import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { envs } from 'src/config/envs';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'lifetrack.auth',
                    protoPath: join(process.cwd(), 'src/proto/auth.proto'),
                    url: envs.authGrpcUrl,
                }
            }
        ])
    ],
    exports: [ClientsModule],
})
export class GrpcModule { }