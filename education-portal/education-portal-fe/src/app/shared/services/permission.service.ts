import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse, Permission } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  readonly #httpClient = inject(HttpClient);

  getPermissions(): Observable<BaseResponse<Permission[]>> {
    return this.#httpClient.get<BaseResponse<Permission[]>>('api/permissions');
  }
}
