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
}

export interface AddExerciseRequest {
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
  referenceMediaUrl?: string;
}

export interface ExerciseResponse {
  exerciseId: string;
  recoveryPlanId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
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

export interface RehabServiceGrpc {
  listRecoveryPlansByUser(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListRecoveryPlansByUserResponse>;
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
}
