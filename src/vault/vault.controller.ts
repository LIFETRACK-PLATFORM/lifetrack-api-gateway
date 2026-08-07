import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
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
  CreateVaultItemBodyDto,
  UpdateVaultItemBodyDto,
} from './dto/vault.dto';
import { buildUserMetadata } from '../finance/helpers/build-user-metadata';
import { VaultServiceGrpc } from './interfaces/vault-service.grpc.interface';

type RequestWithUser = Request & { user: AuthenticatedUser };

@Controller('vault')
@UseGuards(SessionOrBearerGuard)
export class VaultController implements OnModuleInit {
  private vaultService: VaultServiceGrpc;

  constructor(@Inject('VAULT_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.vaultService =
      this.client.getService<VaultServiceGrpc>('VaultService');
  }

  @Get('salt')
  getOrCreateSalt(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.vaultService.getOrCreateVaultSalt({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('items')
  listItems(@Req() req: RequestWithUser) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.vaultService.listVaultItems({}, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Post('items')
  createItem(@Req() req: RequestWithUser, @Body() dto: CreateVaultItemBodyDto) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.vaultService.createVaultItem(dto, metadata).pipe(
      catchError((err) => {
        throw new RpcException(parseGrpcError(err));
      }),
    );
  }

  @Get('items/:id')
  getEncryptedItem(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.vaultService
      .getEncryptedVaultItem({ vaultItemId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Put('items/:id')
  updateItem(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateVaultItemBodyDto,
  ) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.vaultService
      .updateVaultItem({ vaultItemId: id, ...dto }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }

  @Delete('items/:id')
  deleteItem(@Req() req: RequestWithUser, @Param('id') id: string) {
    const metadata = buildUserMetadata(req.user.userId);
    return this.vaultService
      .deleteVaultItem({ vaultItemId: id }, metadata)
      .pipe(
        catchError((err) => {
          throw new RpcException(parseGrpcError(err));
        }),
      );
  }
}
