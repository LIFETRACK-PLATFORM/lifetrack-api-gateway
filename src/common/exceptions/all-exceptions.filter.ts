import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

// Red de seguridad de último recurso: RpcCustomExceptionFilter y el
// ValidationPipe cubren los casos esperados (RpcException, errores de
// validación), pero cualquier excepción que se escape de esas dos vías
// (ej. un fallo de red hacia un microservicio, un bug no previsto) caía
// antes en el manejo por defecto de Nest, que responde en inglés y sin
// dejar rastro del error real en los logs.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }

    this.logger.error(
      'Excepción no controlada',
      exception instanceof Error ? exception.stack : String(exception),
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Error interno del servidor',
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    });
  }
}
