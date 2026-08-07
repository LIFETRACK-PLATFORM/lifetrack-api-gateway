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

export interface UpdateAccountRequest {
  accountId: string;
  name: string;
  type: string;
  currency: string;
}

export interface DeleteAccountResponse {
  deleted: boolean;
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

export interface UpdateCategoryRequest {
  categoryId: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface DeleteCategoryResponse {
  deleted: boolean;
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
  recurringItemId?: string;
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

export interface UpdateBudgetRequest {
  budgetId: string;
  amount: number;
}

export interface DeleteBudgetResponse {
  deleted: boolean;
}

export interface ListBudgetsRequest {
  periodMonth: number;
  periodYear: number;
}

export interface ListBudgetsResponse {
  budgets: BudgetResponse[];
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

export interface CategoryExpenseSummary {
  categoryId: string;
  amount: number;
}

export interface CurrencyMonthlySummary {
  currency: string;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  expensesByCategory: CategoryExpenseSummary[];
}

export interface GetMonthlySummaryRequest {
  periodMonth: number;
  periodYear: number;
}

export interface GetMonthlySummaryResponse {
  summaries: CurrencyMonthlySummary[];
}

export interface RecurringItemResponse {
  recurringItemId: string;
  userId: string;
  name: string;
  amount: number;
  kind: string;
  accountId: string;
  categoryId: string;
  dayOfMonth: number;
  mode: string;
  active: boolean;
}

export interface CreateRecurringItemRequest {
  name: string;
  amount: number;
  kind: string;
  accountId: string;
  categoryId: string;
  dayOfMonth: number;
  mode: string;
}

export interface UpdateRecurringItemRequest {
  recurringItemId: string;
  name: string;
  amount: number;
  kind: string;
  accountId: string;
  categoryId: string;
  dayOfMonth: number;
  mode: string;
  active: boolean;
}

export interface DeleteRecurringItemResponse {
  deleted: boolean;
}

export interface ListRecurringItemsResponse {
  items: RecurringItemResponse[];
}

export interface ProcessRecurringItemsResponse {
  pendingReminders: RecurringItemResponse[];
  generatedTransactions: TransactionResponse[];
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
  updateAccount(
    data: UpdateAccountRequest,
    metadata?: unknown,
  ): Observable<AccountResponse>;
  deleteAccount(
    data: { accountId: string },
    metadata?: unknown,
  ): Observable<DeleteAccountResponse>;
  createCategory(
    data: CreateCategoryRequest,
    metadata?: unknown,
  ): Observable<CategoryResponse>;
  listCategories(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListCategoriesResponse>;
  updateCategory(
    data: UpdateCategoryRequest,
    metadata?: unknown,
  ): Observable<CategoryResponse>;
  deleteCategory(
    data: { categoryId: string },
    metadata?: unknown,
  ): Observable<DeleteCategoryResponse>;
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
  updateBudget(
    data: UpdateBudgetRequest,
    metadata?: unknown,
  ): Observable<BudgetResponse>;
  deleteBudget(
    data: { budgetId: string },
    metadata?: unknown,
  ): Observable<DeleteBudgetResponse>;
  listBudgets(
    data: ListBudgetsRequest,
    metadata?: unknown,
  ): Observable<ListBudgetsResponse>;
  getBudgetStatus(
    data: GetBudgetStatusRequest,
    metadata?: unknown,
  ): Observable<BudgetStatusResponse>;
  getMonthlySummary(
    data: GetMonthlySummaryRequest,
    metadata?: unknown,
  ): Observable<GetMonthlySummaryResponse>;
  createRecurringItem(
    data: CreateRecurringItemRequest,
    metadata?: unknown,
  ): Observable<RecurringItemResponse>;
  updateRecurringItem(
    data: UpdateRecurringItemRequest,
    metadata?: unknown,
  ): Observable<RecurringItemResponse>;
  deleteRecurringItem(
    data: { recurringItemId: string },
    metadata?: unknown,
  ): Observable<DeleteRecurringItemResponse>;
  listRecurringItems(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListRecurringItemsResponse>;
  processRecurringItems(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ProcessRecurringItemsResponse>;
}
