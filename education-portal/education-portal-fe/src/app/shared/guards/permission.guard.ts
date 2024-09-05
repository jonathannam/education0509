import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { PERMISSION, STORAGE_KEY } from '../consts';
import { AuthResponse } from '../models';
import { LocalStorageService } from '../utils';

export function permissionGuard(requiredPermissions?: PERMISSION[]): CanMatchFn {
  return () => {
    const ls = inject(LocalStorageService);
    const currentUser = ls.getItem<AuthResponse>(STORAGE_KEY.currentUser);
    if (!currentUser) {
      return false;
    }
    const permissions = currentUser.permissions;
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    return requiredPermissions.some((p) => permissions.includes(p));
  };
}
