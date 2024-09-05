import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  EMPLOYEE_STATUS,
} from '../shared/consts';
import { Employee, PagingResponse } from '../shared/models';
import { EmployeeService, GetListEmployeeParams } from '../shared/services';

interface EmployeeManagementState {
  vm: PagingResponse<Employee>;
  isLoading: boolean;
  queryParams: GetListEmployeeParams;
}

const initialState: EmployeeManagementState = {
  vm: {
    items: [],
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    totalCount: 0,
  },
  queryParams: {
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    status: EMPLOYEE_STATUS.Active,
  },
  isLoading: false,
};

export const EmployeeManagementStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      employeeService = inject(EmployeeService),
      nzMessage = inject(NzMessageService)
    ) => {
      function loadEmployees() {
        patchState(store, { isLoading: true });
        return employeeService.getListEmployees(store.queryParams()).pipe(
          tapResponse({
            next: (res) => {
              patchState(store, {
                vm: res.data,
              });
            },
            error: (err: HttpErrorResponse) => {
              nzMessage.error(err.error.message);
              patchState(store, {
                vm: {
                  items: [],
                  pageIndex: DEFAULT_PAGE_INDEX,
                  pageSize: DEFAULT_PAGE_SIZE,
                  totalCount: 0,
                },
              });
            },
            finalize: () => {
              patchState(store, {
                isLoading: false,
              });
            },
          })
        );
      }
      const changePageIndex = rxMethod<number>(
        pipe(
          switchMap((pageIndex) => {
            patchState(store, (state) => ({
              queryParams: {
                ...state.queryParams,
                pageIndex,
              },
            }));
            return loadEmployees();
          })
        )
      );
      return {
        changePageIndex,
        changePageSize: rxMethod<number>(
          pipe(
            switchMap((pageSize) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  pageSize,
                },
              }));
              return loadEmployees();
            })
          )
        ),
        searchName: rxMethod<string>(
          pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((name) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  name,
                },
              }));
              return loadEmployees();
            })
          )
        ),
        searchPosition: rxMethod<string>(
          pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((position) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  position,
                },
              }));
              return loadEmployees();
            })
          )
        ),
        changeStatusFilter: rxMethod<EMPLOYEE_STATUS>(
          pipe(
            switchMap((status) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  status,
                },
              }));
              return loadEmployees();
            })
          )
        ),
        terminateEmployee: rxMethod<number>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            exhaustMap((id) =>
              employeeService.terminateEmployee(id).pipe(
                tapResponse({
                  next: () => {
                    nzMessage.success('Terminate employee successfully');
                    changePageIndex(DEFAULT_PAGE_INDEX);
                  },
                  error: (err: HttpErrorResponse) => {
                    nzMessage.error(err.error.message);
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        inactivateEmployee: rxMethod<number>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            exhaustMap((id) =>
              employeeService.inactivateEmployee(id).pipe(
                tapResponse({
                  next: () => {
                    nzMessage.success('Inactivate employee successfully');
                    changePageIndex(DEFAULT_PAGE_INDEX);
                  },
                  error: (err: HttpErrorResponse) => {
                    nzMessage.error(err.error.message);
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        activateEmployee: rxMethod<number>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            exhaustMap((id) =>
              employeeService.activateEmployee(id).pipe(
                tapResponse({
                  next: () => {
                    nzMessage.success('Activate employee successfully');
                    changePageIndex(DEFAULT_PAGE_INDEX);
                  },
                  error: (err: HttpErrorResponse) => {
                    nzMessage.error(err.error.message);
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
      };
    }
  ),
  withHooks({
    onInit(store) {
      store.changePageIndex(DEFAULT_PAGE_INDEX);
    },
  })
);
