import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import type { Request } from 'express';
import { catchError } from 'rxjs';
import { SessionOrBearerGuard } from 'src/auth/guards/session-or-bearer.guard';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { parseGrpcError } from 'src/common/helpers/parse-grpc-error';
import {
  CreateAccountBodyDto,
  CreateBudgetBodyDto,
  CreateCategoryBodyDto,
  CreateRecurringItemBodyDto,
  CreateTransactionBodyDto,
  UpdateAccountBodyDto,
  UpdateBudgetBodyDto,
  UpdateCategoryBodyDto,
  UpdateRecurringItemBodyDto,
  UpdateTransactionBodyDto,
} from './dto/finance.dto';
import { buildUserMetadata } from './helpers/build-user-metadata';
import { FinanceServiceGrpc } from './interfaces/finance-service.grpc.interface';

type RequestWithUser = Request & { user: AuthenticatedUser };

@Controller('finance')
@UseGuards(SessionOrBearerGuard)
export class FinanceController implements OnModuleInit {
  private financeService: FinanceServiceGrpc;

  constructor(@Inject('FINANCE_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.financeService =
      this.client.getService<FinanceServiceGrpc>('FinanceService');
  }

  @Post('accounts')
  createAccount(
    @Req() req: RequestWithUser,
    @Body() dto: CreateAccountBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.createAccount(dto, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('accounts')
  listAccounts(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.listAccounts({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Put('accounts/:id')
  updateAccount(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateAccountBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .updateAccount({ accountId: id, ...dto }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('accounts/:id')
  deleteAccount(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.deleteAccount({ accountId: id }, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('categories')
  createCategory(
    @Req() req: RequestWithUser,
    @Body() dto: CreateCategoryBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.createCategory(dto, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('categories')
  listCategories(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.listCategories({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Put('categories/:id')
  updateCategory(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .updateCategory({ categoryId: id, ...dto }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('categories/:id')
  deleteCategory(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .deleteCategory({ categoryId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('transactions')
  createTransaction(
    @Req() req: RequestWithUser,
    @Body() dto: CreateTransactionBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.createTransaction(dto, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Put('transactions/:id')
  updateTransaction(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .updateTransaction({ transactionId: id, ...dto }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('transactions/:id')
  deleteTransaction(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .deleteTransaction({ transactionId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Get('transactions')
  listTransactions(
    @Req() req: RequestWithUser,
    @Query('accountId') accountId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .listTransactions({ accountId, categoryId, fromDate, toDate }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('budgets')
  createBudget(@Req() req: RequestWithUser, @Body() dto: CreateBudgetBodyDto) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.createBudget(dto, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Put('budgets/:id')
  updateBudget(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateBudgetBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .updateBudget({ budgetId: id, ...dto }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('budgets/:id')
  deleteBudget(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.deleteBudget({ budgetId: id }, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('budgets')
  listBudgets(
    @Req() req: RequestWithUser,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .listBudgets(
        { periodMonth: Number(month), periodYear: Number(year) },
        metadata,
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Get('budgets/status')
  getBudgetStatus(
    @Req() req: RequestWithUser,
    @Query('categoryId') categoryId: string,
    @Query('periodMonth') periodMonth: string,
    @Query('periodYear') periodYear: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .getBudgetStatus(
        {
          categoryId,
          periodMonth: Number(periodMonth),
          periodYear: Number(periodYear),
        },
        metadata,
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Get('summary')
  getMonthlySummary(
    @Req() req: RequestWithUser,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .getMonthlySummary(
        { periodMonth: Number(month), periodYear: Number(year) },
        metadata,
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('recurring-items')
  createRecurringItem(
    @Req() req: RequestWithUser,
    @Body() dto: CreateRecurringItemBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.createRecurringItem(dto, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('recurring-items')
  listRecurringItems(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.listRecurringItems({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Put('recurring-items/:id')
  updateRecurringItem(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringItemBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .updateRecurringItem({ recurringItemId: id, ...dto }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('recurring-items/:id')
  deleteRecurringItem(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService
      .deleteRecurringItem({ recurringItemId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Post('recurring-items/process')
  processRecurringItems(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.financeService.processRecurringItems({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }
}
