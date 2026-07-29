import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordUserDto {
  @IsString()
  token: string;

  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
