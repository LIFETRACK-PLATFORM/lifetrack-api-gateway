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
    userId: string;
    email: string;
    roles: string[];
    status: string;
}

export interface AuthServiceGrpc {
    register(data: RegisterRequest): Observable<RegisterResponse>;
    login(data: LoginRequest): Observable<LoginResponse>;
}
