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
  Query,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { catchError, firstValueFrom, map } from 'rxjs';
import {
  AuthServiceGrpc,
  LoginResponse,
  LoginWithOAuthResponse,
} from './interfaces/auth-service.grpc.interface';
import { parseGrpcError } from 'src/common/helpers/parse-grpc-error';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshUserDto } from './dto/refresh-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { ForgotPasswordUserDto } from './dto/forgot-password-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { ConfirmEmailUserDto } from './dto/confirm-email-user.dto';
import { ResendVerificationUserDto } from './dto/resend-verification-user.dto';
import { LinkAccountUserDto } from './dto/link-account-user.dto';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  legacySessionCookieOptions,
  sessionCookieOptions,
} from './constants/session-cookies';
import {
  createOAuthPkceSession,
  OAUTH_PROVIDER_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  oauthSessionCookieOptions,
} from './helpers/oauth-pkce';
import { envs } from 'src/config/envs';

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

  @Throttle(AUTH_THROTTLE)
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

  @Throttle(AUTH_THROTTLE)
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
    return this.authService.resendVerification(resendVerificationUserDto).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Throttle(AUTH_THROTTLE)
  @Get('google')
  startGoogleOAuth(@Res() res: Response) {
    this.startOAuthFlow('GOOGLE', res, {
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      clientId: envs.googleClientId,
      scope: 'openid email profile',
    });
  }

  @Throttle(AUTH_THROTTLE)
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback('GOOGLE', code, state, error, req, res);
  }

  @Throttle(AUTH_THROTTLE)
  @Get('github')
  startGitHubOAuth(@Res() res: Response) {
    this.startOAuthFlow('GITHUB', res, {
      authorizeUrl: 'https://github.com/login/oauth/authorize',
      clientId: envs.githubClientId,
      scope: 'user:email',
    });
  }

  @Throttle(AUTH_THROTTLE)
  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback('GITHUB', code, state, error, req, res);
  }

  @Throttle(AUTH_THROTTLE)
  @Post('link-account')
  linkAccount(
    @Body() linkAccountUserDto: LinkAccountUserDto,
    @Headers('x-client-type') clientType: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.linkOAuthAccount(linkAccountUserDto).pipe(
      map((result) => this.deliverTokens(result, clientType, res)),
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  private startOAuthFlow(
    provider: string,
    res: Response,
    config: { authorizeUrl: string; clientId: string; scope: string },
  ) {
    const pkce = createOAuthPkceSession();
    const cookieOptions = oauthSessionCookieOptions();

    res.cookie(OAUTH_STATE_COOKIE, pkce.state, cookieOptions);
    res.cookie(OAUTH_VERIFIER_COOKIE, pkce.codeVerifier, cookieOptions);
    res.cookie(OAUTH_PROVIDER_COOKIE, provider, cookieOptions);

    const redirectUri = `${envs.oauthRedirectBaseUrl}/auth/${provider.toLowerCase()}/callback`;
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.scope,
      state: pkce.state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: 'S256',
    });

    res.redirect(`${config.authorizeUrl}?${params.toString()}`);
  }

  private async handleOAuthCallback(
    provider: string,
    code: string | undefined,
    state: string | undefined,
    error: string | undefined,
    req: Request,
    res: Response,
  ) {
    const frontendBase = envs.corsOrigin;
    const cookieOptions = oauthSessionCookieOptions();

    const clearOAuthCookies = () => {
      res.clearCookie(OAUTH_STATE_COOKIE, cookieOptions);
      res.clearCookie(OAUTH_VERIFIER_COOKIE, cookieOptions);
      res.clearCookie(OAUTH_PROVIDER_COOKIE, cookieOptions);
    };

    if (error || !code || !state) {
      clearOAuthCookies();
      res.redirect(`${frontendBase}/login?error=oauth_denied`);
      return;
    }

    const storedState = req.cookies?.[OAUTH_STATE_COOKIE] as string | undefined;
    const codeVerifier = req.cookies?.[OAUTH_VERIFIER_COOKIE] as
      | string
      | undefined;
    const storedProvider = req.cookies?.[OAUTH_PROVIDER_COOKIE] as
      | string
      | undefined;

    if (
      !storedState ||
      !codeVerifier ||
      storedState !== state ||
      storedProvider !== provider
    ) {
      clearOAuthCookies();
      res.redirect(`${frontendBase}/login?error=oauth_invalid_state`);
      return;
    }

    try {
      const result = await firstValueFrom(
        this.authService.loginWithOAuth({
          provider,
          code,
          codeVerifier,
        }),
      );
      clearOAuthCookies();
      this.handleOAuthResult(result, res, frontendBase);
    } catch (err) {
      clearOAuthCookies();
      throw new RpcException(parseGrpcError(err));
    }
  }

  private handleOAuthResult(
    result: LoginWithOAuthResponse,
    res: Response,
    frontendBase: string,
  ) {
    if (result.status === 'ACCOUNT_LINK_REQUIRED') {
      const params = new URLSearchParams({
        linkToken: result.linkToken ?? '',
        provider: result.provider ?? '',
      });
      res.redirect(`${frontendBase}/link-account?${params.toString()}`);
      return;
    }

    if (
      result.status === 'AUTHENTICATED' &&
      result.accessToken &&
      result.refreshToken
    ) {
      const options = sessionCookieOptions();
      res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, options);
      res.cookie(ACCESS_TOKEN_COOKIE, result.accessToken, options);
      res.clearCookie(REFRESH_TOKEN_COOKIE, legacySessionCookieOptions());
      res.redirect(`${frontendBase}/onboarding`);
      return;
    }

    res.redirect(`${frontendBase}/login?error=oauth_failed`);
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
