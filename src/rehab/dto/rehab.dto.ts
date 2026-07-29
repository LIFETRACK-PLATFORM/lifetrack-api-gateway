import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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
