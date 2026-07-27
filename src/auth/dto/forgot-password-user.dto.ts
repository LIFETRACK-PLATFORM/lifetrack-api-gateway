import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordUserDto {
  @IsString()
  @IsEmail()
  email: string;
}
