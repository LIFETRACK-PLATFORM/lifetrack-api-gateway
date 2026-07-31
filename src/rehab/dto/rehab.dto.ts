import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
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
