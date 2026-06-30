import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/register-user.dto';
import { catchError } from 'rxjs';
import { AuthServiceGrpc } from './interfaces/auth-service.grpc.interface';
import { parseGrpcError } from 'src/common/helpers/parse-grpc-error';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceGrpc;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    const { name, ...rest } = registerUserDto;
    return this.authService.register({ ...rest, displayName: name }).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }
}
