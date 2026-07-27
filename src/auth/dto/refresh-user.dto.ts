import { IsOptional, IsString } from 'class-validator';

export class RefreshUserDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
