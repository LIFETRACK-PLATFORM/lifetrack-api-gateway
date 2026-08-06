import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import type { Request } from 'express';
import { catchError } from 'rxjs';
import { SessionOrBearerGuard } from 'src/auth/guards/session-or-bearer.guard';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { parseGrpcError } from 'src/common/helpers/parse-grpc-error';
import { buildUserMetadata } from 'src/rehab/helpers/build-user-metadata';
import { UpdateMyProfileBodyDto } from './dto/update-my-profile.dto';
import { UserServiceGrpc } from './interfaces/user-service.grpc.interface';

type RequestWithUser = Request & { user: AuthenticatedUser };

@Controller('users')
@UseGuards(SessionOrBearerGuard)
export class UsersController implements OnModuleInit {
  private userService: UserServiceGrpc;

  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceGrpc>('UserService');
  }

  @Get('me')
  getMyProfile(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.userService.getMyProfile({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Patch('me')
  updateMyProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateMyProfileBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.userService
      .updateMyProfile(
        {
          displayName: body.displayName,
          firstName: body.firstName ?? '',
          lastName: body.lastName ?? '',
          avatarUrl: body.avatarUrl ?? '',
          phone: body.phone ?? '',
          timezone: body.timezone,
          language: body.language,
        },
        metadata,
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }
}
