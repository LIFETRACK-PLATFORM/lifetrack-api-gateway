import { Observable } from 'rxjs';

export interface AccountResponse {
  accountId: string;
  userId: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
}

export interface CreateAccountRequest {
  name: string;
  type: string;
  currency: string;
  initialBalance: number;
}

export interface ListAccountsResponse {
  accounts: AccountResponse[];
}

export interface CategoryResponse {
  categoryId: string;
  userId: string;
  name: string;
  kind: string;
  icon?: string;
  color?: string;
}

export interface CreateCategoryRequest {
  name: string;
  kind: string;
  icon?: string;
  color?: string;
}

export interface ListCategoriesResponse {
  categories: CategoryResponse[];
}

export interface TransactionResponse {
  transactionId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  kind: string;
  description?: string;
  occurredAt: string;
  accountBalanceAfter: number;
  budgetExceeded: boolean;
}

export interface CreateTransactionRequest {
  accountId: string;
  categoryId: string;
  amount: number;
  kind: string;
  description?: string;
  occurredAt: string;
}

export interface UpdateTransactionRequest {
  amount: number;
  description?: string;
  occurredAt: string;
}

export interface DeleteTransactionResponse {
  deleted: boolean;
  accountBalanceAfter: number;
}

export interface ListTransactionsRequest {
  accountId?: string;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ListTransactionsResponse {
  transactions: TransactionResponse[];
}

export interface BudgetResponse {
  budgetId: string;
  categoryId: string;
  amount: number;
  periodMonth: number;
  periodYear: number;
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  periodMonth: number;
  periodYear: number;
}

export interface GetBudgetStatusRequest {
  categoryId: string;
  periodMonth: number;
  periodYear: number;
}

export interface BudgetStatusResponse {
  categoryId: string;
  periodMonth: number;
  periodYear: number;
  budgetAmount: number;
  spentAmount: number;
  exceeded: boolean;
}

export interface FinanceServiceGrpc {
  createAccount(
    data: CreateAccountRequest,
    metadata?: unknown,
  ): Observable<AccountResponse>;
  listAccounts(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListAccountsResponse>;
  createCategory(
    data: CreateCategoryRequest,
    metadata?: unknown,
  ): Observable<CategoryResponse>;
  listCategories(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListCategoriesResponse>;
  createTransaction(
    data: CreateTransactionRequest,
    metadata?: unknown,
  ): Observable<TransactionResponse>;
  updateTransaction(
    data: UpdateTransactionRequest & { transactionId: string },
    metadata?: unknown,
  ): Observable<TransactionResponse>;
  deleteTransaction(
    data: { transactionId: string },
    metadata?: unknown,
  ): Observable<DeleteTransactionResponse>;
  listTransactions(
    data: ListTransactionsRequest,
    metadata?: unknown,
  ): Observable<ListTransactionsResponse>;
  createBudget(
    data: CreateBudgetRequest,
    metadata?: unknown,
  ): Observable<BudgetResponse>;
  getBudgetStatus(
    data: GetBudgetStatusRequest,
    metadata?: unknown,
  ): Observable<BudgetStatusResponse>;
}
