import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRecoveryPlanBodyDto {
  @IsString()
  @IsNotEmpty()
  bodyPart: string;

  @IsString()
  @IsNotEmpty()
  injuryType: string;

  @IsDateString()
  surgeryDate: string;
}

export class AddExerciseBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsInt()
  @Min(1)
  phase: number;

  @IsOptional()
  @IsString()
  referenceMediaUrl?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
}

export class UpdateExerciseBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsInt()
  @Min(1)
  phase: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
}

export class LogExerciseBodyDto {
  @IsInt()
  @Min(0)
  setsDone: number;

  @IsInt()
  @Min(0)
  repsDone: number;

  @IsDateString()
  date: string;
}

export class AddAppointmentBodyDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsIn(['THERAPY', 'MEDICAL'])
  type: 'THERAPY' | 'MEDICAL';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(12)
  repeatWeeks?: number;
}

export class MarkAppointmentAttendanceBodyDto {
  @IsBoolean()
  attended: boolean;
}

export class UpdateRecoveryPlanStatusBodyDto {
  @IsIn(['ACTIVE', 'COMPLETED', 'PAUSED'])
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export class MarkExerciseCompletionBodyDto {
  @IsDateString()
  date: string;

  @IsBoolean()
  completed: boolean;
}

export class AddPainLogBodyDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(0)
  @Max(10)
  level: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AddMeasurementBodyDto {
  @IsIn([
    'FLEXION_DEGREES',
    'EXTENSION_DEGREES',
    'QUAD_CIRCUMFERENCE_CM',
    'WEIGHT_KG',
  ])
  type:
    | 'FLEXION_DEGREES'
    | 'EXTENSION_DEGREES'
    | 'QUAD_CIRCUMFERENCE_CM'
    | 'WEIGHT_KG';

  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsDateString()
  date: string;
}
