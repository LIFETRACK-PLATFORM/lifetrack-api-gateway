/**
 * Variables mínimas para que config/envs.ts no falle al cargar módulos en Jest/CI.
 * Jenkins no inyecta .env en la etapa de unit tests.
 */
process.env.PORT ??= '3000';
process.env.NATS_SERVERS ??= 'nats://localhost:4222';
process.env.AUTH_GRPC_URL ??= 'localhost:50051';
process.env.USER_GRPC_URL ??= 'localhost:50052';
process.env.REHAB_GRPC_URL ??= 'localhost:50053';
process.env.FINANCE_GRPC_URL ??= 'localhost:50054';
process.env.VAULT_GRPC_URL ??= 'localhost:50055';
process.env.CORS_ORIGIN ??= 'http://localhost:3002';
process.env.OAUTH_REDIRECT_BASE_URL ??= 'http://localhost:3000';
process.env.GOOGLE_CLIENT_ID ??= 'test-google-client-id';
process.env.GITHUB_CLIENT_ID ??= 'test-github-client-id';
