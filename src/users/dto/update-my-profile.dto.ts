import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMyProfileBodyDto {
  @IsString()
  @MinLength(1)
  displayName: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(1)
  timezone: string;

  @IsString()
  @MinLength(1)
  language: string;
}
