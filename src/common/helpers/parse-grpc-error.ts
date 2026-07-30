import { status as GrpcStatus } from '@grpc/grpc-js';

const GRPC_TO_HTTP_STATUS: Record<number, number> = {
  [GrpcStatus.INVALID_ARGUMENT]: 400,
  [GrpcStatus.UNAUTHENTICATED]: 401,
  [GrpcStatus.PERMISSION_DENIED]: 403,
  [GrpcStatus.NOT_FOUND]: 404,
  [GrpcStatus.ALREADY_EXISTS]: 409,
  [GrpcStatus.FAILED_PRECONDITION]: 422,
  [GrpcStatus.RESOURCE_EXHAUSTED]: 429,
  [GrpcStatus.UNIMPLEMENTED]: 501,
  [GrpcStatus.UNAVAILABLE]: 503,
};

interface GrpcError {
  code: number;
  details: string;
}

export function parseGrpcError(err: GrpcError): {
  status: number;
  message: string;
} {
  if (err && typeof err.code === 'number') {
    return {
      status: GRPC_TO_HTTP_STATUS[err.code] ?? 500,
      message: err.details ?? 'Error interno del servidor',
    };
  }
  return { status: 500, message: 'Error interno del servidor' };
}
