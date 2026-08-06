import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAccountBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['CASH', 'BANK', 'CARD', 'OTHER'])
  type: 'CASH' | 'BANK' | 'CARD' | 'OTHER';

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @Min(0)
  initialBalance: number;
}

export class CreateCategoryBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['INCOME', 'EXPENSE'])
  kind: 'INCOME' | 'EXPENSE';

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateTransactionBodyDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsPositive()
  amount: number;

  @IsIn(['INCOME', 'EXPENSE'])
  kind: 'INCOME' | 'EXPENSE';

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  occurredAt: string;
}

export class UpdateTransactionBodyDto {
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  occurredAt: string;
}

export class CreateBudgetBodyDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsPositive()
  amount: number;

  @IsInt()
  @Min(1)
  @Max(12)
  periodMonth: number;

  @IsInt()
  @Min(2000)
  periodYear: number;
}
