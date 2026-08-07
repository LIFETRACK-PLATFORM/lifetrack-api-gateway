import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVaultItemBodyDto {
  @IsString()
  @IsNotEmpty()
  site: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsString()
  @IsNotEmpty()
  encryptedBlob: string;

  @IsString()
  @IsNotEmpty()
  iv: string;

  @IsString()
  @IsNotEmpty()
  salt: string;

  @IsString()
  @IsNotEmpty()
  encryptionVersion: string;
}

export class UpdateVaultItemBodyDto {
  @IsString()
  @IsNotEmpty()
  site: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsString()
  @IsNotEmpty()
  encryptedBlob: string;

  @IsString()
  @IsNotEmpty()
  iv: string;

  @IsString()
  @IsNotEmpty()
  salt: string;

  @IsString()
  @IsNotEmpty()
  encryptionVersion: string;
}
