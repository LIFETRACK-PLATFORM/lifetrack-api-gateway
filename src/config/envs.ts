import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  AUTH_GRPC_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    AUTH_GRPC_URL: joi.string().required(),
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
};
