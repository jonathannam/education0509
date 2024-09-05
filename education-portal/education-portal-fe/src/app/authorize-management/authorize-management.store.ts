import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { exhaustMap, Observable, pipe, switchMap, tap } from 'rxjs';
import { FormStatus } from '../shared/consts';
import { BaseResponse, Permission, Role } from '../shared/models';
import { PermissionService, RoleService } from '../shared/services';

interface AuthorizeManagementState {
  listRole: Role[];
  listPermission: Permission[];
  listPermissionByRole: Permission[];
  activeRole: Role | null;
  formStatus: FormStatus;
}

const initialState: AuthorizeManagementState = {
  listRole: [],
  listPermission: [],
  listPermissionByRole: [],
  activeRole: null,
  formStatus: 'idle',
};

export const AuthorizeManagementStore = signalStore(
  withState(initialState),
  withComputed(({ formStatus }) => ({
    isDisabledButton: computed(() => formStatus() === 'loading'),
  })),
  withMethods(
    (
      store,
      roleService = inject(RoleService),
      permissionService = inject(PermissionService),
      nzMessage = inject(NzMessageService)
    ) => {
      const getRoles = rxMethod<void>(
        pipe(
          switchMap(() =>
            roleService.getAllRoles().pipe(
              tapResponse({
                next: (res) => {
                  patchState(store, {
                    listRole: res.data,
                  });
                  changeRole(res.data[0]);
                },
                error: () => {},
              })
            )
          )
        )
      );
      const getPermissionsByRole = rxMethod<number>(
        pipe(
          tap(() => patchState(store, { formStatus: 'loading' })),
          switchMap((roleId) =>
            roleService.getPermissionsByRole(roleId).pipe(
              tapResponse({
                next: (res) => {
                  patchState(store, { listPermissionByRole: res.data });
                },
                error: () => {},
                finalize: () => patchState(store, { formStatus: 'idle' }),
              })
            )
          )
        )
      );

      function changeRole(role: Role): void {
        patchState(store, { activeRole: role });
        getPermissionsByRole(role.id);
      }
      return {
        getRoles,
        getPermissions: rxMethod<void>(
          pipe(
            switchMap(() =>
              permissionService.getPermissions().pipe(
                tapResponse({
                  next: (res) => {
                    patchState(store, { listPermission: res.data });
                  },
                  error: () => {},
                })
              )
            )
          )
        ),
        changeRole,
        createRole(roleName: string): Observable<BaseResponse> {
          patchState(store, { formStatus: 'loading' });
          return roleService.createRole(roleName).pipe(
            tap({
              next: () => {
                nzMessage.success(`Create role ${roleName} successfully.`);
                getRoles();
              },
              error: (err: HttpErrorResponse) => {
                nzMessage.error(err.error.message);
              },
              finalize: () => patchState(store, { formStatus: 'idle' }),
            })
          );
        },
        togglePermission(isChecked: boolean, permission: Permission): void {
          let listPermissionByRole = store.listPermissionByRole();
          if (isChecked) {
            listPermissionByRole.push(permission);
          } else {
            listPermissionByRole = listPermissionByRole.filter(
              (p) => p.id !== permission.id
            );
          }
          patchState(store, { listPermissionByRole });
        },
        updatePermissionForRole: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { formStatus: 'loading' })),
            switchMap(() => {
              const updatedRoleId = store.activeRole()!.id;
              const listPermissionIds = store
                .listPermissionByRole()
                .map((p) => p.id);
              return roleService
                .updatePermissionForRole(updatedRoleId, listPermissionIds)
                .pipe(
                  tapResponse({
                    next: () => {
                      nzMessage.success('Update permission successfully');
                    },
                    error: (err: HttpErrorResponse) => {
                      nzMessage.error(err.error.message);
                    },
                    complete: () => patchState(store, { formStatus: 'idle' }),
                  })
                );
            })
          )
        ),
        deleteRole: rxMethod<Role>(
          pipe(
            tap(() => patchState(store, { formStatus: 'loading' })),
            exhaustMap((role) =>
              roleService.deleteRole(role.id).pipe(
                tapResponse({
                  next: () => {
                    nzMessage.success(`Delete role ${role.name} successfully.`);
                    getRoles();
                  },
                  error: (err: HttpErrorResponse) => {
                    nzMessage.error(err.error.message);
                  },
                  finalize: () => patchState(store, { formStatus: 'idle' }),
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
      store.getPermissions();
      store.getRoles();
    },
  })
);
