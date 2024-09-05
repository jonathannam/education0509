import { NzMessageService } from 'ng-zorro-antd/message';
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
import { pipe, switchMap, tap } from 'rxjs';
import { FormStatus, MENU, STORAGE_KEY } from '../shared/consts';
import { UserLoginRequest, UserService } from '../shared/services';
import { AuthStore } from '../shared/state';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from '../shared/models';

interface LoginState {
  formStatus: FormStatus;
}

const initialState: LoginState = {
  formStatus: 'idle',
};

function getRedirectRouteByPermission(currentUser: AuthResponse): string {
  let firstPermission = currentUser.permissions[0];
  if (!firstPermission) {
    return '/';
  }
  const redirectRoute = MENU.find((item) =>
    item.acceptPermissions?.includes(firstPermission)
  );
  if (!redirectRoute) {
    return '/';
  }
  return redirectRoute.url;
}

export const LoginStore = signalStore(
  withState(initialState),
  withComputed(({ formStatus }) => ({
    isDisabledButton: computed(() => formStatus() === 'loading'),
  })),
  withMethods(
    (
      store,
      authStore = inject(AuthStore),
      userService = inject(UserService),
      nzMessage = inject(NzMessageService),
      router = inject(Router)
    ) => ({
      login: rxMethod<UserLoginRequest>(
        pipe(
          tap(() => patchState(store, { formStatus: 'loading' })),
          switchMap((request) =>
            userService.login(request).pipe(
              tapResponse({
                next: (response) => {
                  authStore.setCurrentUser(response.data);
                  router.navigate([
                    getRedirectRouteByPermission(response.data),
                  ]);
                },
                error: (err: HttpErrorResponse) => {
                  nzMessage.error(err.error.message);
                },
                finalize: () => {
                  patchState(store, { formStatus: 'idle' });
                },
              })
            )
          )
        )
      ),
    })
  )
);
