import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { App } from 'supertest/types';
import { of } from 'rxjs';
import { AuthController } from '../src/auth/auth.controller';

const mockClientGrpc = {
  getService: jest.fn().mockReturnValue({
    login: jest.fn().mockReturnValue(
      of({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        userId: 'u1',
        email: 'alice@test.com',
        roles: ['USER'],
        status: 'ACTIVE',
      }),
    ),
    register: jest.fn().mockReturnValue(
      of({
        credentialId: 'c1',
        userId: 'u1',
        email: 'alice@test.com',
        roles: ['USER'],
        status: 'PENDING_VERIFICATION',
      }),
    ),
    resendVerification: jest.fn().mockReturnValue(of({ success: true })),
  }),
};

describe('Rate limiting en /auth/login (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
      ],
      controllers: [AuthController],
      providers: [
        { provide: 'AUTH_SERVICE', useValue: mockClientGrpc },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rechaza con 429 tras exceder el límite estricto de /auth/login para una misma IP', async () => {
    const credentials = { email: 'alice@test.com', password: 'x' };

    for (let i = 0; i < 5; i++) {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(credentials);
      expect(res.status).not.toBe(429);
    }

    const blocked = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials);

    expect(blocked.status).toBe(429);
  });
});

describe('Rate limiting en /auth/register (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
      ],
      controllers: [AuthController],
      providers: [
        { provide: 'AUTH_SERVICE', useValue: mockClientGrpc },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deja pasar un reintento de registro sobre un email pendiente y rechaza con 429 tras exceder el límite', async () => {
    const payload = {
      email: 'alice@test.com',
      password: 'x',
      name: 'Alice',
    };

    for (let i = 0; i < 5; i++) {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(payload);
      expect(res.status).not.toBe(429);
    }

    const blocked = await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload);

    expect(blocked.status).toBe(429);
  });
});

describe('POST /auth/resend-verification (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
      ],
      controllers: [AuthController],
      providers: [
        { provide: 'AUTH_SERVICE', useValue: mockClientGrpc },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('reenvía la verificación y rechaza con 429 tras exceder el límite por IP', async () => {
    const payload = { email: 'alice@test.com' };

    for (let i = 0; i < 5; i++) {
      const res = await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send(payload);
      expect(res.status).not.toBe(429);
    }

    const blocked = await request(app.getHttpServer())
      .post('/auth/resend-verification')
      .send(payload);

    expect(blocked.status).toBe(429);
  });
});
