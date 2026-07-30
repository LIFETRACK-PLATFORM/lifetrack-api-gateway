import { IsEmail, IsString } from 'class-validator';

export class ResendVerificationUserDto {
  @IsString()
  @IsEmail()
  email: string;
}
