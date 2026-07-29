import { Observable } from 'rxjs';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  roles: string[];
}

export interface RegisterResponse {
  credentialId: string;
  userId: string;
  email: string;
  roles: string[];
  status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  roles: string[];
  status: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface ValidateTokenRequest {
  accessToken: string;
}

export interface ValidateTokenResponse {
  sub: string;
  email: string;
  roles: string[];
}

export interface MeRequest {
  refreshToken: string;
}

export interface MeResponse {
  userId: string;
  email: string;
  roles: string[];
  status: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface ConfirmEmailResponse {
  success: boolean;
}

export interface AuthServiceGrpc {
  register(data: RegisterRequest): Observable<RegisterResponse>;
  login(data: LoginRequest): Observable<LoginResponse>;
  refresh(data: RefreshRequest): Observable<LoginResponse>;
  logout(data: LogoutRequest): Observable<LogoutResponse>;
  validateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse>;
  me(data: MeRequest): Observable<MeResponse>;
  forgotPassword(
    data: ForgotPasswordRequest,
  ): Observable<ForgotPasswordResponse>;
  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse>;
  confirmEmail(data: ConfirmEmailRequest): Observable<ConfirmEmailResponse>;
}
