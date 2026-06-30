import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcError {
  status: number;
  message: string;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError() as RpcError | string;

    if (typeof rpcError === 'string' && rpcError.includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError,
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }

    return response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
