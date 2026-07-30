import {
  Body,
  Controller,
  Headers,
  Inject,
  OnModuleInit,
  Post,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { catchError, map } from 'rxjs';
import {
  AuthServiceGrpc,
  LoginResponse,
} from './interfaces/auth-service.grpc.interface';
import { parseGrpcError } from 'src/common/helpers/parse-grpc-error';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshUserDto } from './dto/refresh-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { ForgotPasswordUserDto } from './dto/forgot-password-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { ConfirmEmailUserDto } from './dto/confirm-email-user.dto';
import { ResendVerificationUserDto } from './dto/resend-verification-user.dto';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  legacySessionCookieOptions,
  sessionCookieOptions,
} from './constants/session-cookies';

// Límite por IP para endpoints públicos sensibles a fuerza bruta (login,
// register, forgot-password, reset-password, etc.). Pensado para bloquear solo
// volumen anormal, no el uso normal de un usuario real:
// - ráfaga corta: hasta 25 intentos por minuto.
// - abuso sostenido: hasta 20 intentos cada 15 minutos.
const AUTH_THROTTLE = {
  default: { limit: 25, ttl: 60_000 },
  long: { limit: 20, ttl: 15 * 60_000 },
};

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceGrpc;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  @Throttle(AUTH_THROTTLE)
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    const { name, ...rest } = registerUserDto;
    return this.authService.register({ ...rest, displayName: name }).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Throttle(AUTH_THROTTLE)
  @Post('login')
  loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Headers('x-client-type') clientType: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto).pipe(
      map((result) => this.deliverTokens(result, clientType, res)),
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('refresh')
  refreshSession(
    @Body() refreshUserDto: RefreshUserDto,
    @Headers('x-client-type') clientType: string | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = this.extractRefreshToken(
      req,
      refreshUserDto?.refreshToken,
    );

    return this.authService.refresh({ refreshToken }).pipe(
      map((result) => this.deliverTokens(result, clientType, res)),
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('me')
  getCurrentUser(@Req() req: Request) {
    const refreshToken = this.extractRefreshTokenFromCookie(req);

    return this.authService.me({ refreshToken }).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('logout')
  logoutUser(
    @Body() logoutUserDto: LogoutUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = this.extractRefreshToken(
      req,
      logoutUserDto?.refreshToken,
    );

    return this.authService.logout({ refreshToken }).pipe(
      map((result) => {
        const options = sessionCookieOptions();
        const legacyOptions = legacySessionCookieOptions();
        res.clearCookie(REFRESH_TOKEN_COOKIE, options);
        res.clearCookie(ACCESS_TOKEN_COOKIE, options);
        res.clearCookie(REFRESH_TOKEN_COOKIE, legacyOptions);
        res.clearCookie(ACCESS_TOKEN_COOKIE, legacyOptions);
        return result;
      }),
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Throttle(AUTH_THROTTLE)
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordUserDto: ForgotPasswordUserDto) {
    return this.authService.forgotPassword(forgotPasswordUserDto).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Throttle(AUTH_THROTTLE)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.authService.resetPassword(resetPasswordUserDto).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Throttle(AUTH_THROTTLE)
  @Post('confirm-email')
  confirmEmail(@Body() confirmEmailUserDto: ConfirmEmailUserDto) {
    return this.authService.confirmEmail(confirmEmailUserDto).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Throttle(AUTH_THROTTLE)
  @Post('resend-verification')
  resendVerification(
    @Body() resendVerificationUserDto: ResendVerificationUserDto,
  ) {
    return this.authService
      .resendVerification(resendVerificationUserDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  private extractRefreshToken(req: Request, bodyToken?: string): string {
    const cookieToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;
    return cookieToken ?? bodyToken ?? '';
  }

  private extractRefreshTokenFromCookie(req: Request): string {
    return (req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined) ?? '';
  }

  private deliverTokens(
    result: LoginResponse,
    clientType: string | undefined,
    res: Response,
  ) {
    const { refreshToken, accessToken, ...body } = result;
    const options = sessionCookieOptions();

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, options);
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, options);
    // Purga cookies huérfanas de path='/auth' emitidas antes de este cambio.
    res.clearCookie(REFRESH_TOKEN_COOKIE, legacySessionCookieOptions());

    if (clientType === 'mobile') {
      return { ...body, accessToken, refreshToken };
    }

    return body;
  }
}
