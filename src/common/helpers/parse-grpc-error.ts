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

export function parseGrpcError(err: any) {
    if (err && typeof err.code === 'number') {
        return {
            status: GRPC_TO_HTTP_STATUS[err.code] ?? 500,
            message: err.details ?? 'Internal server error',
        };
    }
    return err;
}
