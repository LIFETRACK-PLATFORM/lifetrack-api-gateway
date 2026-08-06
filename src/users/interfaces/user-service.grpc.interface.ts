import { Observable } from 'rxjs';
import type { Metadata } from '@grpc/grpc-js';

export type GetMyProfileRequest = Record<string, never>;

export type UpdateMyProfileRequest = {
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  timezone: string;
  language: string;
};

export type UserProfileResponse = {
  id: string;
  authUserId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  phone: string;
  timezone: string;
  language: string;
  status: string;
};

export interface UserServiceGrpc {
  getMyProfile(
    data: GetMyProfileRequest,
    metadata?: Metadata,
  ): Observable<UserProfileResponse>;
  updateMyProfile(
    data: UpdateMyProfileRequest,
    metadata?: Metadata,
  ): Observable<UserProfileResponse>;
}
