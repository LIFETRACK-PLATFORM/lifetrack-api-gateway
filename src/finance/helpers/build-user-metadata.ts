import { Metadata } from '@grpc/grpc-js';
import { GRPC_USER_ID_METADATA_KEY } from './grpc-user-metadata';

export function buildUserMetadata(userId: string): Metadata {
  const metadata = new Metadata();
  metadata.set(GRPC_USER_ID_METADATA_KEY, userId);
  return metadata;
}
