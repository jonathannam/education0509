import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BaseResponse,
  Employee,
  PagingQueryParams,
  PagingResponse,
} from '../models';
import { EMPLOYEE_STATUS } from '../consts';

export interface UpsertEmployeeRequest {
  name: string;
  position: string;
  department: string;
  address: string;
  email: string;
  contactNumber: string;
}

export interface GetListEmployeeParams extends PagingQueryParams {
  name?: string;
  position?: string;
  status?: EMPLOYEE_STATUS;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  readonly #httpClient = inject(HttpClient);

  createEmployee(request: UpsertEmployeeRequest): Observable<BaseResponse> {
    return this.#httpClient.post<BaseResponse>('api/employees', request);
  }

  getListEmployees(
    params?: GetListEmployeeParams
  ): Observable<BaseResponse<PagingResponse<Employee>>> {
    return this.#httpClient.get<BaseResponse<PagingResponse<Employee>>>(
      'api/employees',
      {
        params: {
          ...params,
        },
      }
    );
  }

  getEmployeeById(id: number): Observable<BaseResponse<Employee>> {
    return this.#httpClient.get<BaseResponse<Employee>>(`api/employees/${id}`);
  }

  updateEmployee(
    id: number,
    request: UpsertEmployeeRequest
  ): Observable<BaseResponse> {
    return this.#httpClient.patch<BaseResponse>(`api/employees/${id}`, request);
  }

  terminateEmployee(id: number): Observable<BaseResponse> {
    return this.#httpClient.patch<BaseResponse>(
      `api/employees/${id}/terminate`,
      {}
    );
  }

  inactivateEmployee(id: number): Observable<BaseResponse> {
    return this.#httpClient.patch<BaseResponse>(
      `api/employees/${id}/inactivate`,
      {}
    );
  }

  activateEmployee(id: number): Observable<BaseResponse> {
    return this.#httpClient.patch<BaseResponse>(
      `api/employees/${id}/activate`,
      {}
    );
  }
}
