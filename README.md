# api-gateway

API Gateway del proyecto LIFETRACK. Punto de entrada HTTP que enruta requests hacia los microservicios internos via gRPC y NATS.

## Stack

- NestJS 11
- gRPC (comunicación con auth-service)
- NATS JetStream (comunicación con user-service)
- pnpm 10.21.0

## Variables de entorno

```env
PORT=3000
NATS_SERVERS=nats://nats:4222
AUTH_GRPC_URL=auth-service:50051
```

## Comandos

```bash
# instalar dependencias
pnpm install

# desarrollo
pnpm run start:dev

# producción
pnpm run start:prod

# tests
pnpm run test:cov
```
