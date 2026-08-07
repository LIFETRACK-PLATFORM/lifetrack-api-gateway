import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Delete,
  Query,
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
  AddAppointmentBodyDto,
  AddExerciseBodyDto,
  AddMeasurementBodyDto,
  AddPainLogBodyDto,
  CreateRecoveryPlanBodyDto,
  LogExerciseBodyDto,
  MarkAppointmentAttendanceBodyDto,
  MarkExerciseCompletionBodyDto,
  UpdateExerciseBodyDto,
  UpdateRecoveryPlanStatusBodyDto,
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

  @Get('plans/:id/today')
  getTodayExercises(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .getTodayExercises({ recoveryPlanId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Get('plans/:id/weekly-summary')
  getWeeklySummary(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Query('referenceDate') referenceDate?: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .getWeeklySummary({ recoveryPlanId: id, referenceDate }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Get('plans/:id/pain-logs')
  listPainLogs(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .listPainLogs({ recoveryPlanId: id, from, to }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('plans')
  createPlan(
    @Req() req: RequestWithUser,
    @Body() body: CreateRecoveryPlanBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService.createRecoveryPlan(body, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Patch('plans/:id/status')
  updatePlanStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: UpdateRecoveryPlanStatusBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .updateRecoveryPlanStatus({ recoveryPlanId: id, ...body }, metadata)
      .pipe(
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

  @Delete('exercises/:id')
  deleteExercise(@Req() req: RequestWithUser, @Param('id') exerciseId: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService.deleteExercise({ exerciseId }, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Patch('exercises/:id')
  updateExercise(
    @Req() req: RequestWithUser,
    @Param('id') exerciseId: string,
    @Body() body: UpdateExerciseBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .updateExercise({ exerciseId, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('plans/:id/appointments')
  addAppointment(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: AddAppointmentBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .addAppointment({ recoveryPlanId: id, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Patch('appointments/:id/attendance')
  markAppointmentAttendance(
    @Req() req: RequestWithUser,
    @Param('id') appointmentId: string,
    @Body() body: MarkAppointmentAttendanceBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .markAppointmentAttendance({ appointmentId, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('appointments/:id')
  deleteAppointment(
    @Req() req: RequestWithUser,
    @Param('id') appointmentId: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService.deleteAppointment({ appointmentId }, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('plans/:id/pain-logs')
  addPainLog(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: AddPainLogBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .addPainLog({ recoveryPlanId: id, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('plans/:id/measurements')
  addMeasurement(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: AddMeasurementBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .addMeasurement({ recoveryPlanId: id, ...body }, metadata)
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

  @Post('exercises/:id/completions')
  markExerciseCompletion(
    @Req() req: RequestWithUser,
    @Param('id') exerciseId: string,
    @Body() body: MarkExerciseCompletionBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.rehabService
      .markExerciseCompletion({ exerciseId, ...body }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }
}
