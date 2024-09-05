import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { exhaustMap, pipe, tap } from 'rxjs';
import { DEFAULT_PAGE_INDEX, FormStatus } from '../../../shared/consts';
import {
  EmployeeService,
  UpsertEmployeeRequest,
} from '../../../shared/services';
import { EmployeeManagementStore } from './../../employee-management.store';

interface EmployeeFormState {
  status: FormStatus;
}

const initialState: EmployeeFormState = {
  status: 'idle',
};

export const EmployeeFormStore = signalStore(
  withState(initialState),
  withComputed(({ status }) => ({
    isDisabledButton: computed(() => status() === 'loading'),
  })),
  withMethods(
    (
      store,
      employeeService = inject(EmployeeService),
      nzMessage = inject(NzMessageService),
      nzModalRef = inject(NzModalRef)
    ) => ({
      createEmployee: rxMethod<{
        employeeManagementStore: InstanceType<typeof EmployeeManagementStore>;
        request: UpsertEmployeeRequest;
      }>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          exhaustMap((params) =>
            employeeService.createEmployee(params.request).pipe(
              tapResponse({
                next: () => {
                  nzMessage.success('Create employee successfully');
                  nzModalRef.close();
                  params.employeeManagementStore.changePageIndex(
                    DEFAULT_PAGE_INDEX
                  );
                },
                error: (err: HttpErrorResponse) => {
                  nzMessage.error(err.error.message);
                },
              })
            )
          )
        )
      ),
      updateEmployee: rxMethod<{
        id: number;
        employeeManagementStore: InstanceType<typeof EmployeeManagementStore>;
        request: UpsertEmployeeRequest;
      }>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          exhaustMap((params) =>
            employeeService.updateEmployee(params.id, params.request).pipe(
              tapResponse({
                next: () => {
                  nzMessage.success('Update employee successfully.');
                  nzModalRef.close();
                  params.employeeManagementStore.changePageIndex(
                    DEFAULT_PAGE_INDEX
                  );
                },
                error: (err: HttpErrorResponse) => {
                  nzMessage.error(err.error.message);
                },
              })
            )
          )
        )
      ),
    })
  )
);
