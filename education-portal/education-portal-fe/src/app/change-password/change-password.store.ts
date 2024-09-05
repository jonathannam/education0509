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
import { pipe, switchMap, tap } from 'rxjs';
import { FormStatus } from '../shared/consts';
import { ChangePasswordRequest, UserService } from '../shared/services';

interface ChangePasswordState {
  formStatus: FormStatus;
}

const initialState: ChangePasswordState = {
  formStatus: 'idle',
};

export const ChangePasswordStore = signalStore(
  withState(initialState),
  withComputed(({ formStatus }) => ({
    isDisabledButton: computed(() => formStatus() === 'loading'),
  })),
  withMethods(
    (
      store,
      userService = inject(UserService),
      nzMessage = inject(NzMessageService),
    ) => ({
      changePassword: rxMethod<ChangePasswordRequest>(
        pipe(
          tap(() => patchState(store, { formStatus: 'loading' })),
          switchMap((request) =>
            userService.changePassword(request).pipe(
              tapResponse({
                next: (response) => {
                  nzMessage.success('Change password successfully.');
                },
                error: (err: HttpErrorResponse) => {
                  nzMessage.error(err.error.message);
                },
                finalize: () => {
                  patchState(store, { formStatus: 'idle' });
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
