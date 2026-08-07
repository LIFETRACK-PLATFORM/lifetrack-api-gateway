import { Observable } from 'rxjs';

export interface RecoveryPlanSummary {
  recoveryPlanId: string;
  bodyPart: string;
  injuryType: string;
  surgeryDate: string;
  status: string;
}

export interface ListRecoveryPlansByUserResponse {
  plans: RecoveryPlanSummary[];
}

export interface CreateRecoveryPlanRequest {
  bodyPart: string;
  injuryType: string;
  surgeryDate: string;
}

export interface RecoveryPlanResponse {
  recoveryPlanId: string;
  userId: string;
  bodyPart: string;
  injuryType: string;
  surgeryDate: string;
  status: string;
}

export interface RecoveryProgressResponse {
  recoveryPlanId: string;
  bodyPart: string;
  injuryType: string;
  surgeryDate: string;
  status: string;
  exercises: unknown[];
  appointments: unknown[];
  measurements: unknown[];
  progressPhotos: unknown[];
  painLogs: unknown[];
}

export interface AddExerciseRequest {
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
  referenceMediaUrl?: string;
  daysOfWeek?: number[];
}

export interface ExerciseResponse {
  exerciseId: string;
  recoveryPlanId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
  daysOfWeek: number[];
}

export interface LogExerciseRequest {
  setsDone: number;
  repsDone: number;
  date: string;
}

export interface ExerciseLogResponse {
  exerciseLogId: string;
  exerciseId: string;
  setsDone: number;
  repsDone: number;
  date: string;
}

export interface AppointmentResponse {
  appointmentId: string;
  recoveryPlanId: string;
  date: string;
  provider: string;
  notes?: string;
  type: string;
  attended?: boolean;
}

export interface AddAppointmentRequest {
  date: string;
  provider: string;
  type: string;
  notes?: string;
  repeatWeeks?: number;
}

export interface AddAppointmentResponse {
  appointments: AppointmentResponse[];
}

export interface MarkAppointmentAttendanceRequest {
  appointmentId: string;
  attended: boolean;
}

export interface MarkAppointmentAttendanceResponse {
  appointmentId: string;
  recoveryPlanId: string;
  attended: boolean;
}

export interface MarkExerciseCompletionRequest {
  exerciseId: string;
  date: string;
  completed: boolean;
}

export interface MarkExerciseCompletionResponse {
  exerciseId: string;
  date: string;
  completed: boolean;
}

export interface GetTodayExercisesRequest {
  recoveryPlanId: string;
}

export interface TodayExerciseEntry {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
  scheduledToday: boolean;
  completedToday: boolean;
  urgent: boolean;
}

export interface GetTodayExercisesResponse {
  exercises: TodayExerciseEntry[];
}

export interface GetWeeklySummaryRequest {
  recoveryPlanId: string;
  referenceDate?: string;
}

export interface WeeklySummaryDay {
  date: string;
  due: number;
  completed: number;
  compliant: boolean;
  isFuture: boolean;
}

export interface GetWeeklySummaryResponse {
  recoveryPlanId: string;
  weekStart: string;
  weekEnd: string;
  days: WeeklySummaryDay[];
  weeklyCompliancePercent: number;
  appointmentsByType: { therapy: number; medical: number };
  streakDays: number;
}

export interface AddPainLogRequest {
  recoveryPlanId: string;
  date: string;
  level: number;
  note?: string;
}

export interface AddMeasurementRequest {
  recoveryPlanId: string;
  type: string;
  value: number;
  unit: string;
  date: string;
}

export interface MeasurementResponse {
  measurementId: string;
  recoveryPlanId: string;
  type: string;
  value: number;
  unit: string;
  date: string;
}

export interface PainLogResponse {
  painLogId: string;
  recoveryPlanId: string;
  date: string;
  level: number;
  note?: string;
}

export interface ListPainLogsRequest {
  recoveryPlanId: string;
  from: string;
  to: string;
}

export interface ListPainLogsResponse {
  painLogs: PainLogResponse[];
}

export interface UpdateRecoveryPlanStatusRequest {
  recoveryPlanId: string;
  status: string;
}

export interface UpdateRecoveryPlanStatusResponse {
  recoveryPlanId: string;
  status: string;
}

export interface RehabServiceGrpc {
  listRecoveryPlansByUser(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListRecoveryPlansByUserResponse>;
  updateRecoveryPlanStatus(
    data: UpdateRecoveryPlanStatusRequest,
    metadata?: unknown,
  ): Observable<UpdateRecoveryPlanStatusResponse>;
  createRecoveryPlan(
    data: CreateRecoveryPlanRequest & { userId?: string },
    metadata?: unknown,
  ): Observable<RecoveryPlanResponse>;
  listRecoveryProgress(
    data: { recoveryPlanId: string },
    metadata?: unknown,
  ): Observable<RecoveryProgressResponse>;
  logExercise(
    data: LogExerciseRequest & { exerciseId: string },
    metadata?: unknown,
  ): Observable<ExerciseLogResponse>;
  addExercise(
    data: AddExerciseRequest & { recoveryPlanId: string },
    metadata?: unknown,
  ): Observable<ExerciseResponse>;
  deleteExercise(
    data: { exerciseId: string },
    metadata?: unknown,
  ): Observable<{
    exerciseId: string;
    recoveryPlanId: string;
    deleted: boolean;
  }>;
  updateExercise(
    data: {
      exerciseId: string;
      name: string;
      targetSets: number;
      targetReps: number;
      phase: number;
      daysOfWeek?: number[];
    },
    metadata?: unknown,
  ): Observable<ExerciseResponse>;
  addAppointment(
    data: AddAppointmentRequest & { recoveryPlanId: string },
    metadata?: unknown,
  ): Observable<AddAppointmentResponse>;
  markAppointmentAttendance(
    data: MarkAppointmentAttendanceRequest,
    metadata?: unknown,
  ): Observable<MarkAppointmentAttendanceResponse>;
  deleteAppointment(
    data: { appointmentId: string },
    metadata?: unknown,
  ): Observable<{
    appointmentId: string;
    recoveryPlanId: string;
    deleted: boolean;
  }>;
  markExerciseCompletion(
    data: MarkExerciseCompletionRequest,
    metadata?: unknown,
  ): Observable<MarkExerciseCompletionResponse>;
  getTodayExercises(
    data: GetTodayExercisesRequest,
    metadata?: unknown,
  ): Observable<GetTodayExercisesResponse>;
  getWeeklySummary(
    data: GetWeeklySummaryRequest,
    metadata?: unknown,
  ): Observable<GetWeeklySummaryResponse>;
  addPainLog(
    data: AddPainLogRequest,
    metadata?: unknown,
  ): Observable<PainLogResponse>;
  addMeasurement(
    data: AddMeasurementRequest,
    metadata?: unknown,
  ): Observable<MeasurementResponse>;
  listPainLogs(
    data: ListPainLogsRequest,
    metadata?: unknown,
  ): Observable<ListPainLogsResponse>;
}
