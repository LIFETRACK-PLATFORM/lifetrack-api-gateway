import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { SessionOrBearerGuard } from './session-or-bearer.guard';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../constants/session-cookies';

const mockClientGrpc = {
  getService: jest.fn(),
};

function createContext(
  headers: Record<string, string> = {},
  cookies: Record<string, string> = {},
): { context: ExecutionContext; req: Request & { user?: { userId: string } } } {
  const req = { headers, cookies } as Request & { user?: { userId: string } };
  const context = {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as ExecutionContext;
  return { context, req };
}

describe('SessionOrBearerGuard', () => {
  let guard: SessionOrBearerGuard;
  let authService: {
    validateToken: jest.Mock;
    me: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      validateToken: jest.fn(),
      me: jest.fn(),
    };
    mockClientGrpc.getService.mockReturnValue(authService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionOrBearerGuard,
        { provide: 'AUTH_SERVICE', useValue: mockClientGrpc },
      ],
    }).compile();

    guard = module.get(SessionOrBearerGuard);
    guard.onModuleInit();
  });

  it('autentica con Bearer token (mobile)', async () => {
    authService.validateToken.mockReturnValue(
      of({ sub: 'u1', email: 'a@test.com', roles: ['USER'] }),
    );
    const { context, req } = createContext({ authorization: 'Bearer mobile-token' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.user?.userId).toBe('u1');
  });

  it('autentica con cookie accessToken (web)', async () => {
    authService.validateToken.mockReturnValue(
      of({ sub: 'u2', email: 'b@test.com', roles: ['USER'] }),
    );
    const { context } = createContext({}, { [ACCESS_TOKEN_COOKIE]: 'web-access' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(authService.validateToken).toHaveBeenCalledWith({
      accessToken: 'web-access',
    });
  });

  it('autentica con cookie refreshToken si access expiró', async () => {
    authService.validateToken.mockReturnValue(
      throwError(() => new Error('expired')),
    );
    authService.me.mockReturnValue(
      of({
        userId: 'u3',
        email: 'c@test.com',
        roles: ['USER'],
        status: 'ACTIVE',
      }),
    );
    const { context } = createContext(
      {},
      {
        [ACCESS_TOKEN_COOKIE]: 'expired-access',
        [REFRESH_TOKEN_COOKIE]: 'valid-refresh',
      },
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(authService.me).toHaveBeenCalledWith({ refreshToken: 'valid-refresh' });
  });

  it('rechaza petición sin credenciales', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
