import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
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
import {
  AddExerciseBodyDto,
  CreateRecoveryPlanBodyDto,
  LogExerciseBodyDto,
} from './dto/rehab.dto';
import { buildUserMetadata } from './helpers/build-user-metadata';
import { RehabServiceGrpc } from './interfaces/rehab-service.grpc.interface';

type RequestWithUser = Request & { user: AuthenticatedUser };

@Controller('rehab')
@UseGuards(SessionOrBearerGuard)
export class RehabController implements OnModuleInit {
  private rehabService: RehabServiceGrpc;

  constructor(@Inject('REHAB_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.rehabService =
      this.client.getService<RehabServiceGrpc>('RehabService');
  }

  @Get('plans')
  listPlans(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService.listRecoveryPlansByUser({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('plans/:id/progress')
  getPlanProgress(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .listRecoveryProgress({ recoveryPlanId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('plans')
  createPlan(@Req() req: RequestWithUser, @Body() body: CreateRecoveryPlanBodyDto) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService.createRecoveryPlan(body, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('plans/:id/exercises')
  addExercise(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: AddExerciseBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .addExercise({ recoveryPlanId: id, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('exercises/:id/logs')
  logExercise(
    @Req() req: RequestWithUser,
    @Param('id') exerciseId: string,
    @Body() body: LogExerciseBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .logExercise({ exerciseId, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }
}
