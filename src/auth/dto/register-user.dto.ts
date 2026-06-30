import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../interfaces/role.interface';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
