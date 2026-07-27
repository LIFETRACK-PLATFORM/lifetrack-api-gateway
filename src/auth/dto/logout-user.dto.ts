import { IsOptional, IsString } from 'class-validator';

export class LogoutUserDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
