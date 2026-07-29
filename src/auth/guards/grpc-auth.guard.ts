import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthServiceGrpc } from '../interfaces/auth-service.grpc.interface';

@Injectable()
export class GrpcAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceGrpc;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractBearerToken(req);

    if (!accessToken) {
      throw new UnauthorizedException('Token de acceso requerido');
    }

    try {
      const payload = await firstValueFrom(
        this.authService.validateToken({ accessToken }),
      );
      (req as Request & { user?: unknown }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractBearerToken(req: Request): string | undefined {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return undefined;
    }
    return header.slice('Bearer '.length);
  }
}
