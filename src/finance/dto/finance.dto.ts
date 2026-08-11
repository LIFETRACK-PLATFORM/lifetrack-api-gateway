import {
  IsBoolean,
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

  @IsIn(['PEN', 'USD'])
  currency: 'PEN' | 'USD';

  @IsNumber()
  @Min(0)
  initialBalance: number;
}

export class UpdateAccountBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['CASH', 'BANK', 'CARD', 'OTHER'])
  type: 'CASH' | 'BANK' | 'CARD' | 'OTHER';

  @IsIn(['PEN', 'USD'])
  currency: 'PEN' | 'USD';
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

export class UpdateCategoryBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @IsOptional()
  @IsString()
  recurringItemId?: string;
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

export class UpdateBudgetBodyDto {
  @IsPositive()
  amount: number;
}

export class CreateRecurringItemBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  amount: number;

  @IsIn(['INCOME', 'EXPENSE'])
  kind: 'INCOME' | 'EXPENSE';

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsInt()
  @Min(1)
  @Max(28)
  dayOfMonth: number;

  @IsIn(['AUTO', 'REMIND'])
  mode: 'AUTO' | 'REMIND';
}

export class UpdateRecurringItemBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  amount: number;

  @IsIn(['INCOME', 'EXPENSE'])
  kind: 'INCOME' | 'EXPENSE';

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsInt()
  @Min(1)
  @Max(28)
  dayOfMonth: number;

  @IsIn(['AUTO', 'REMIND'])
  mode: 'AUTO' | 'REMIND';

  @IsBoolean()
  active: boolean;
}

export class CreateDebtBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  lender?: string;

  @IsIn(['CREDIT_CARD', 'LOAN', 'OTHER'])
  type: 'CREDIT_CARD' | 'LOAN' | 'OTHER';

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsPositive()
  totalOwed: number;

  @IsOptional()
  @IsPositive()
  originalAmount?: number;

  @IsOptional()
  @IsPositive()
  minimumPayment?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay?: number;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class UpdateDebtBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  lender?: string;

  @IsIn(['CREDIT_CARD', 'LOAN', 'OTHER'])
  type: 'CREDIT_CARD' | 'LOAN' | 'OTHER';

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsOptional()
  @IsPositive()
  originalAmount?: number;

  @IsOptional()
  @IsPositive()
  minimumPayment?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay?: number;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class RegisterDebtPaymentBodyDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  occurredAt: string;
}

export class AdjustDebtBalanceBodyDto {
  @IsNumber()
  @Min(0)
  newTotalOwed: number;
}
