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
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

const MEASUREMENT_TYPES = [
  'FLEXION_DEGREES',
  'EXTENSION_DEGREES',
  'QUAD_CIRCUMFERENCE_CM',
  'WEIGHT_KG',
  'WAIST_CM',
  'HIP_CM',
  'NECK_CM',
  'OTHER',
] as const;

type MeasurementTypeValue = (typeof MEASUREMENT_TYPES)[number];

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

  @IsIn(['REPS', 'DURATION'])
  metricType: 'REPS' | 'DURATION';

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  targetDurationMinutes?: number;

  @IsOptional()
  @IsString()
  referenceMediaUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

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

  @IsIn(['REPS', 'DURATION'])
  metricType: 'REPS' | 'DURATION';

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  targetDurationMinutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;

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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

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

export class UpdateAppointmentBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

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
  @IsIn(MEASUREMENT_TYPES)
  type: MeasurementTypeValue;

  @ValidateIf((o: AddMeasurementBodyDto) => o.type === 'OTHER')
  @IsNotEmpty({ message: 'customLabel es obligatorio cuando type es OTHER' })
  @IsString()
  customLabel?: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsDateString()
  date: string;
}

export class UpdateMeasurementBodyDto {
  @IsIn(MEASUREMENT_TYPES)
  type: MeasurementTypeValue;

  @ValidateIf((o: UpdateMeasurementBodyDto) => o.type === 'OTHER')
  @IsNotEmpty({ message: 'customLabel es obligatorio cuando type es OTHER' })
  @IsString()
  customLabel?: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsDateString()
  date: string;
}

export class SetAdHocProtocolDayBodyDto {
  @IsDateString()
  targetDate: string;

  @IsDateString()
  sourceDate: string;
}
