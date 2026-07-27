import { IsString } from 'class-validator';

export class ConfirmEmailUserDto {
  @IsString()
  token: string;
}
