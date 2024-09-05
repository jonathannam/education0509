import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse, Permission, Role } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  readonly #httpClient = inject(HttpClient);
  getAllRoles(): Observable<BaseResponse<Role[]>> {
    return this.#httpClient.get<BaseResponse<Role[]>>('api/roles');
  }

  getPermissionsByRole(roleId: number): Observable<BaseResponse<Permission[]>> {
    return this.#httpClient.get<BaseResponse<Permission[]>>(
      `api/roles/${roleId}/permissions`
    );
  }

  updatePermissionForRole(
    roleId: number,
    permissionIds: number[]
  ): Observable<BaseResponse> {
    return this.#httpClient.patch<BaseResponse>(`api/roles/${roleId}/permissions`, {
      permissionIds,
    });
  }

  createRole(name: string): Observable<BaseResponse> {
    return this.#httpClient.post<BaseResponse>('api/roles', { name });
  }

  deleteRole(roleId: number): Observable<BaseResponse> {
    return this.#httpClient.delete<BaseResponse>(`api/roles/${roleId}`);
  }
}
