import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { exhaustMap, pipe, tap } from 'rxjs';
import { DEFAULT_PAGE_INDEX, FormStatus } from '../../../shared/consts';
import { CreateUserRequest, UserService } from '../../../shared/services';
import { UserManagementStore } from './../../user-management.store';

interface CreateUserState {
  status: FormStatus;
}

const initialState: CreateUserState = {
  status: 'idle',
};

export const CreateUserStore = signalStore(
  withState(initialState),
  withComputed(({ status }) => ({
    isDisabledButton: computed(() => status() === 'loading'),
  })),
  withMethods(
    (
      store,
      userService = inject(UserService),
      nzMessage = inject(NzMessageService),
      nzModalRef = inject(NzModalRef)
    ) => ({
      createUser: rxMethod<{
        userManagementStore: InstanceType<typeof UserManagementStore>;
        request: CreateUserRequest;
      }>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          exhaustMap((params) =>
            userService.createUser(params.request).pipe(
              tapResponse({
                next: () => {
                  nzMessage.success('Create user successfully');
                  nzModalRef.close();
                  params.userManagementStore.changePageIndex(
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
