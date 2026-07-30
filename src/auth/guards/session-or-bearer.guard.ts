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
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../constants/session-cookies';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { AuthServiceGrpc } from '../interfaces/auth-service.grpc.interface';

type RequestWithUser = Request & { user?: AuthenticatedUser };

@Injectable()
export class SessionOrBearerGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceGrpc;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const bearer = this.extractBearerToken(req);
    if (bearer) {
      try {
        req.user = await this.validateAccessToken(bearer);
        return true;
      } catch {
        throw new UnauthorizedException('Sesión requerida');
      }
    }

    const accessCookie = req.cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined;
    if (accessCookie) {
      try {
        req.user = await this.validateAccessToken(accessCookie);
        return true;
      } catch {
        // access expirado: intentar refresh cookie
      }
    }

    const refreshCookie = req.cookies?.[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;
    if (refreshCookie) {
      try {
        req.user = await this.resolveUserFromRefresh(refreshCookie);
        return true;
      } catch {
        // refresh también inválido/expirado: no hay nada más que intentar
      }
    }

    throw new UnauthorizedException('Sesión requerida');
  }

  private extractBearerToken(req: Request): string | undefined {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return undefined;
    }
    return header.slice('Bearer '.length);
  }

  private async validateAccessToken(token: string): Promise<AuthenticatedUser> {
    const payload = await firstValueFrom(
      this.authService.validateToken({ accessToken: token }),
    );
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }

  private async resolveUserFromRefresh(
    refreshToken: string,
  ): Promise<AuthenticatedUser> {
    const me = await firstValueFrom(this.authService.me({ refreshToken }));
    return {
      userId: me.userId,
      email: me.email,
      roles: me.roles,
    };
  }
}
