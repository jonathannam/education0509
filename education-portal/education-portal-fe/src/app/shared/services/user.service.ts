import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthResponse,
  BaseResponse,
  PagingQueryParams,
  PagingResponse,
  User,
} from '../models';

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRequest {
  username: string;
  roleId: number;
}

export interface GetPagedUsersQueryParams extends PagingQueryParams {
  username?: string;
  isActive?: boolean;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpClient = inject(HttpClient);

  login(request: UserLoginRequest): Observable<BaseResponse<AuthResponse>> {
    return this.#httpClient.post<BaseResponse<AuthResponse>>(
      'api/users/login',
      request,
    );
  }

  refreshToken(token: string): Observable<BaseResponse<AuthResponse>> {
    return this.#httpClient.post<BaseResponse<AuthResponse>>(
      'api/users/refresh-token',
      {
        token,
      },
    );
  }

  getPagedUsers(
    params: GetPagedUsersQueryParams,
  ): Observable<BaseResponse<PagingResponse<User>>> {
    return this.#httpClient.get<BaseResponse<PagingResponse<User>>>(
      'api/users',
      {
        params: {
          ...params,
        },
      },
    );
  }

  createUser(request: CreateUserRequest): Observable<BaseResponse> {
    return this.#httpClient.post<BaseResponse>('api/users', request);
  }

  updateActiveStatus(
    userId: number,
  ): Observable<BaseResponse<{ isActive: boolean }>> {
    return this.#httpClient.patch<BaseResponse<{ isActive: boolean }>>(
      `api/users/${userId}/active-status`,
      {},
    );
  }

  updateUser(
    userId: number,
    request: UpdateUserRequest,
  ): Observable<BaseResponse<{ isActive: boolean }>> {
    return this.#httpClient.patch<BaseResponse<{ isActive: boolean }>>(
      `api/users/${userId}`,
      request,
    );
  }

  resetUserPassword(
    userId: number,
  ): Observable<BaseResponse<{ newPassword: string }>> {
    return this.#httpClient.patch<BaseResponse<{ newPassword: string }>>(
      `api/users/${userId}/reset-password`,
      {},
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<BaseResponse> {
    return this.#httpClient.patch<BaseResponse>(
      'api/users/change-password',
      request,
    );
  }
}
