import { Observable } from 'rxjs';

export interface VaultSaltResponse {
  salt: string;
}

export interface CreateVaultItemRequest {
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
}

export interface VaultItemResponse {
  vaultItemId: string;
  userId: string;
  site: string;
  username: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
}

export interface VaultItemSummary {
  vaultItemId: string;
  site: string;
  username: string;
  encryptionVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListVaultItemsResponse {
  items: VaultItemSummary[];
}

export interface EncryptedVaultItemResponse {
  vaultItemId: string;
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
}

export interface UpdateVaultItemRequest {
  vaultItemId: string;
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
}

export interface DeleteVaultItemResponse {
  deleted: boolean;
}

export interface VaultServiceGrpc {
  getOrCreateVaultSalt(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<VaultSaltResponse>;
  createVaultItem(
    data: CreateVaultItemRequest,
    metadata?: unknown,
  ): Observable<VaultItemResponse>;
  listVaultItems(
    data: Record<string, never>,
    metadata?: unknown,
  ): Observable<ListVaultItemsResponse>;
  getEncryptedVaultItem(
    data: { vaultItemId: string },
    metadata?: unknown,
  ): Observable<EncryptedVaultItemResponse>;
  updateVaultItem(
    data: UpdateVaultItemRequest,
    metadata?: unknown,
  ): Observable<VaultItemResponse>;
  deleteVaultItem(
    data: { vaultItemId: string },
    metadata?: unknown,
  ): Observable<DeleteVaultItemResponse>;
}
