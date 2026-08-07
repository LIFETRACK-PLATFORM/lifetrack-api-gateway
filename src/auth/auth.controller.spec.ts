import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { of, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import type { Response } from 'express';
import type { Request } from 'express';
import { UserRole } from './interfaces/role.interface';
import { cookieSecure } from './constants/session-cookies';

const mockClientGrpc = {
  getService: jest.fn().mockReturnValue({
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    validateToken: jest.fn(),
    me: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    loginWithOAuth: jest.fn(),
    switchOAuthProvider: jest.fn(),
  }),
};

function createMockResponse() {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    redirect: jest.fn(),
  };
}

function asResponse(mock: ReturnType<typeof createMockResponse>): Response {
  return mock as unknown as Response;
}

function createMockRequest(cookies: Record<string, string> = {}): Request {
  return { cookies } as unknown as Request;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    refresh: jest.Mock;
    logout: jest.Mock;
    validateToken: jest.Mock;
    me: jest.Mock;
    forgotPassword: jest.Mock;
    resetPassword: jest.Mock;
    loginWithOAuth: jest.Mock;
    switchOAuthProvider: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'AUTH_SERVICE', useValue: mockClientGrpc }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    controller.onModuleInit();
    authService = mockClientGrpc.getService() as typeof authService;
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('registerUser llama al authService.register con displayName', (done) => {
    const response = { token: 'jwt-token' };
    authService.register.mockReturnValue(of(response));

    controller
      .registerUser({
        name: 'Alice',
        email: 'alice@test.com',
        password: '1234',
        roles: [UserRole.CANDIDATE],
      })
      .subscribe((result) => {
        expect(authService.register).toHaveBeenCalledWith({
          email: 'alice@test.com',
          password: '1234',
          displayName: 'Alice',
          roles: [UserRole.CANDIDATE],
        });
        expect(result).toEqual(response);
        done();
      });
  });

  it('loginUser setea cookies httpOnly y no incluye tokens en el body para web', (done) => {
    const response = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 'u1',
      email: 'alice@test.com',
      roles: ['USER'],
      status: 'ACTIVE',
    };
    authService.login.mockReturnValue(of(response));
    const res = createMockResponse();

    controller
      .loginUser(
        { email: 'alice@test.com', password: '1234' },
        undefined,
        asResponse(res),
      )
      .subscribe((result) => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'alice@test.com',
          password: '1234',
        });
        expect(res.cookie).toHaveBeenCalledWith(
          'refreshToken',
          'refresh-token',
          expect.objectContaining({
            httpOnly: true,
            secure: cookieSecure(),
            path: '/',
          }),
        );
        expect(res.cookie).toHaveBeenCalledWith(
          'accessToken',
          'access-token',
          expect.objectContaining({
            httpOnly: true,
            secure: cookieSecure(),
            path: '/',
          }),
        );
        expect(result).not.toHaveProperty('refreshToken');
        expect(result).not.toHaveProperty('accessToken');
        expect(result).toMatchObject({ userId: 'u1', email: 'alice@test.com' });
        done();
      });
  });

  it('loginUser incluye el refreshToken en el body cuando el cliente es mobile', (done) => {
    const response = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 'u1',
      email: 'alice@test.com',
      roles: ['USER'],
      status: 'ACTIVE',
    };
    authService.login.mockReturnValue(of(response));
    const res = createMockResponse();

    controller
      .loginUser(
        { email: 'alice@test.com', password: '1234' },
        'mobile',
        asResponse(res),
      )
      .subscribe((result) => {
        expect(result).toMatchObject({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        });
        done();
      });
  });

  it('refreshSession usa el refresh token de la cookie si está presente', (done) => {
    const response = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      userId: 'u1',
      email: 'alice@test.com',
      roles: ['USER'],
      status: 'ACTIVE',
    };
    authService.refresh.mockReturnValue(of(response));
    const res = createMockResponse();
    const req = createMockRequest({ refreshToken: 'cookie-refresh-token' });

    controller
      .refreshSession({}, undefined, req, asResponse(res))
      .subscribe(() => {
        expect(authService.refresh).toHaveBeenCalledWith({
          refreshToken: 'cookie-refresh-token',
        });
        done();
      });
  });

  it('refreshSession cae al refresh token del body si no hay cookie', (done) => {
    const response = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      userId: 'u1',
      email: 'alice@test.com',
      roles: ['USER'],
      status: 'ACTIVE',
    };
    authService.refresh.mockReturnValue(of(response));
    const res = createMockResponse();
    const req = createMockRequest();

    controller
      .refreshSession(
        { refreshToken: 'body-refresh-token' },
        undefined,
        req,
        asResponse(res),
      )
      .subscribe(() => {
        expect(authService.refresh).toHaveBeenCalledWith({
          refreshToken: 'body-refresh-token',
        });
        done();
      });
  });

  it('getCurrentUser usa el refresh token de la cookie y devuelve los datos del usuario', (done) => {
    const response = {
      userId: 'u1',
      email: 'alice@test.com',
      roles: ['USER'],
      status: 'ACTIVE',
      provider: 'GOOGLE',
    };
    authService.me.mockReturnValue(of(response));
    const req = createMockRequest({ refreshToken: 'cookie-refresh-token' });

    controller.getCurrentUser(req).subscribe((result) => {
      expect(authService.me).toHaveBeenCalledWith({
        refreshToken: 'cookie-refresh-token',
      });
      expect(result).toEqual(response);
      done();
    });
  });

  it('getCurrentUser llama al servicio con token vacío si no hay cookie', (done) => {
    authService.me.mockReturnValue(
      throwError(() => ({ code: 16, details: 'refresh token inválido' })),
    );
    const req = createMockRequest();

    controller.getCurrentUser(req).subscribe({
      error: (err) => {
        expect(authService.me).toHaveBeenCalledWith({ refreshToken: '' });
        expect(err).toBeInstanceOf(RpcException);
        done();
      },
    });
  });

  it('getCurrentUser lanza RpcException con 401 si el refresh token es inválido', (done) => {
    authService.me.mockReturnValue(
      throwError(() => ({ code: 16, details: 'refresh token inválido' })),
    );
    const req = createMockRequest({ refreshToken: 'invalid-token' });

    controller.getCurrentUser(req).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(RpcException);
        expect((err as RpcException).getError()).toMatchObject({
          status: 401,
        });
        done();
      },
    });
  });

  it('logoutUser limpia las cookies de sesión', (done) => {
    authService.logout.mockReturnValue(of({ success: true }));
    const res = createMockResponse();
    const req = createMockRequest({ refreshToken: 'cookie-refresh-token' });

    controller.logoutUser({}, req, asResponse(res)).subscribe(() => {
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ httpOnly: true, path: '/' }),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.objectContaining({ httpOnly: true, path: '/' }),
      );
      done();
    });
  });

  it('registerUser lanza RpcException si el servicio falla', (done) => {
    authService.register.mockReturnValue(
      throwError(() => ({ code: 6, details: 'email ya existe' })),
    );

    controller
      .registerUser({
        name: 'Alice',
        email: 'alice@test.com',
        password: '1234',
        roles: [UserRole.CANDIDATE],
      })
      .subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(RpcException);
          done();
        },
      });
  });

  it('loginUser lanza RpcException si el servicio falla', (done) => {
    authService.login.mockReturnValue(
      throwError(() => ({ code: 16, details: 'credenciales invalidas' })),
    );
    const res = createMockResponse();

    controller
      .loginUser(
        { email: 'alice@test.com', password: 'wrong' },
        undefined,
        asResponse(res),
      )
      .subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(RpcException);
          done();
        },
      });
  });

  it('forgotPassword llama al authService.forgotPassword con el email', (done) => {
    authService.forgotPassword.mockReturnValue(of({ success: true }));

    controller
      .forgotPassword({ email: 'alice@test.com' })
      .subscribe((result) => {
        expect(authService.forgotPassword).toHaveBeenCalledWith({
          email: 'alice@test.com',
        });
        expect(result).toEqual({ success: true });
        done();
      });
  });

  it('forgotPassword lanza RpcException si el servicio falla', (done) => {
    authService.forgotPassword.mockReturnValue(
      throwError(() => ({ code: 8, details: 'demasiadas solicitudes' })),
    );

    controller.forgotPassword({ email: 'alice@test.com' }).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(RpcException);
        done();
      },
    });
  });

  it('resetPassword llama al authService.resetPassword con token y nueva contraseña', (done) => {
    authService.resetPassword.mockReturnValue(of({ success: true }));

    controller
      .resetPassword({ token: 'raw-token', newPassword: 'NewPass123!' })
      .subscribe((result) => {
        expect(authService.resetPassword).toHaveBeenCalledWith({
          token: 'raw-token',
          newPassword: 'NewPass123!',
        });
        expect(result).toEqual({ success: true });
        done();
      });
  });

  it('resetPassword lanza RpcException si el token es inválido', (done) => {
    authService.resetPassword.mockReturnValue(
      throwError(() => ({ code: 16, details: 'token inválido o expirado' })),
    );

    controller
      .resetPassword({ token: 'bad-token', newPassword: 'NewPass123!' })
      .subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(RpcException);
          done();
        },
      });
  });

  describe('cambio de proveedor OAuth (intent=switch)', () => {
    beforeEach(() => {
      authService.switchOAuthProvider.mockClear();
    });

    it('startGoogleOAuth setea la cookie oauth_intent cuando hay sesión activa', () => {
      const res = createMockResponse();
      const req = createMockRequest({ refreshToken: 'cookie-refresh-token' });

      controller.startGoogleOAuth('switch', req, asResponse(res));

      expect(res.cookie).toHaveBeenCalledWith(
        'oauth_intent',
        'SWITCH',
        expect.anything(),
      );
    });

    it('startGoogleOAuth ignora intent=switch si no hay sesión activa', () => {
      const res = createMockResponse();
      const req = createMockRequest();

      controller.startGoogleOAuth('switch', req, asResponse(res));

      expect(res.cookie).not.toHaveBeenCalledWith(
        'oauth_intent',
        'SWITCH',
        expect.anything(),
      );
    });

    it('googleCallback con intent=switch llama a switchOAuthProvider y redirige al perfil', async () => {
      authService.switchOAuthProvider.mockReturnValue(
        of({ status: 'PROVIDER_SWITCHED', provider: 'GOOGLE' }),
      );
      const res = createMockResponse();
      const req = createMockRequest({
        oauth_state: 'state-1',
        oauth_code_verifier: 'verifier-1',
        oauth_provider: 'GOOGLE',
        oauth_intent: 'SWITCH',
        refreshToken: 'cookie-refresh-token',
      });

      await controller.googleCallback(
        'auth-code',
        'state-1',
        undefined,
        req,
        asResponse(res),
      );

      expect(authService.switchOAuthProvider).toHaveBeenCalledWith({
        refreshToken: 'cookie-refresh-token',
        provider: 'GOOGLE',
        code: 'auth-code',
        codeVerifier: 'verifier-1',
      });
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('/profile?providerSwitch=success'),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        'oauth_intent',
        expect.anything(),
      );
    });

    it('googleCallback con intent=switch redirige con error si el proveedor ya está vinculado a otra cuenta', async () => {
      authService.switchOAuthProvider.mockReturnValue(
        throwError(() => ({
          code: 6,
          details: 'Esa cuenta de Google ya está vinculada a otro usuario',
        })),
      );
      const res = createMockResponse();
      const req = createMockRequest({
        oauth_state: 'state-1',
        oauth_code_verifier: 'verifier-1',
        oauth_provider: 'GOOGLE',
        oauth_intent: 'SWITCH',
        refreshToken: 'cookie-refresh-token',
      });

      await controller.googleCallback(
        'auth-code',
        'state-1',
        undefined,
        req,
        asResponse(res),
      );

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('/profile?providerSwitch=error'),
      );
    });

    it('googleCallback con intent=switch pero sin sesión redirige con error sin llamar al servicio', async () => {
      const res = createMockResponse();
      const req = createMockRequest({
        oauth_state: 'state-1',
        oauth_code_verifier: 'verifier-1',
        oauth_provider: 'GOOGLE',
        oauth_intent: 'SWITCH',
      });

      await controller.googleCallback(
        'auth-code',
        'state-1',
        undefined,
        req,
        asResponse(res),
      );

      expect(authService.switchOAuthProvider).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('/profile?providerSwitch=error'),
      );
    });
  });
});
