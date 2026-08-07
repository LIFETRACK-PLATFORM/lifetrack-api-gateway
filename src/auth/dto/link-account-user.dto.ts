import { IsNotEmpty, IsString } from 'class-validator';

export class LinkAccountUserDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  linkToken: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
