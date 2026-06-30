import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { of, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

const mockClientGrpc = {
  getService: jest.fn().mockReturnValue({
    register: jest.fn(),
    login: jest.fn(),
  }),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { register: jest.Mock; login: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'AUTH_SERVICE', useValue: mockClientGrpc }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    controller.onModuleInit();
    authService = mockClientGrpc.getService() as {
      register: jest.Mock;
      login: jest.Mock;
    };
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
      })
      .subscribe((result) => {
        expect(authService.register).toHaveBeenCalledWith({
          email: 'alice@test.com',
          password: '1234',
          displayName: 'Alice',
        });
        expect(result).toEqual(response);
        done();
      });
  });

  it('loginUser llama al authService.login', (done) => {
    const response = { token: 'jwt-token' };
    authService.login.mockReturnValue(of(response));

    controller
      .loginUser({ email: 'alice@test.com', password: '1234' })
      .subscribe((result) => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'alice@test.com',
          password: '1234',
        });
        expect(result).toEqual(response);
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

    controller
      .loginUser({ email: 'alice@test.com', password: 'wrong' })
      .subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(RpcException);
          done();
        },
      });
  });
});
