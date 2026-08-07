import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  AUTH_GRPC_URL: string;
  USER_GRPC_URL: string;
  REHAB_GRPC_URL: string;
  FINANCE_GRPC_URL: string;
  VAULT_GRPC_URL: string;
  CORS_ORIGIN: string;
  OAUTH_REDIRECT_BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GITHUB_CLIENT_ID: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    AUTH_GRPC_URL: joi.string().required(),
    USER_GRPC_URL: joi.string().required(),
    REHAB_GRPC_URL: joi.string().required(),
    FINANCE_GRPC_URL: joi.string().required(),
    VAULT_GRPC_URL: joi.string().required(),
    CORS_ORIGIN: joi.string().required(),
    OAUTH_REDIRECT_BASE_URL: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GITHUB_CLIENT_ID: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
}) as { error: joi.ValidationError | undefined; value: EnvVars };

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs = {
  port: value.PORT,
  natsServers: value.NATS_SERVERS,
  authGrpcUrl: value.AUTH_GRPC_URL,
  userGrpcUrl: value.USER_GRPC_URL,
  rehabGrpcUrl: value.REHAB_GRPC_URL,
  financeGrpcUrl: value.FINANCE_GRPC_URL,
  vaultGrpcUrl: value.VAULT_GRPC_URL,
  corsOrigin: value.CORS_ORIGIN,
  oauthRedirectBaseUrl: value.OAUTH_REDIRECT_BASE_URL,
  googleClientId: value.GOOGLE_CLIENT_ID,
  githubClientId: value.GITHUB_CLIENT_ID,
};
