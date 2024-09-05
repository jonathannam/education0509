import { Routes } from '@angular/router';
import { PERMISSION } from '../shared/consts';
import { permissionGuard } from '../shared/guards';

export const routes: Routes = [
  {
    path: 'user-management',
    loadComponent: () =>
      import('../user-management/user-management.component').then(
        (c) => c.UserManagementComponent,
      ),
    canMatch: [permissionGuard([PERMISSION.UserManagement])],
  },
  {
    path: 'authorize-management',
    loadComponent: () =>
      import('../authorize-management/authorize-management.component').then(
        (c) => c.AuthorizeManagementComponent,
      ),
    canMatch: [permissionGuard([PERMISSION.AuthorizeManagement])],
  },
  {
    path: 'employee-management',
    loadComponent: () =>
      import('../employee-management/employee-management.component').then(
        (c) => c.EmployeeManagementComponent,
      ),
    canMatch: [permissionGuard([PERMISSION.EmployeeManagement])],
  },
  {
    path: 'operation-management',
    loadComponent: () =>
      import('../operation-management/operation-management.component').then(
        (c) => c.OperationManagementComponent,
      ),
    canMatch: [permissionGuard([PERMISSION.OperationManagement])],
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('../change-password/change-password.component').then(
        (c) => c.ChangePasswordComponent,
      ),
  },
  {
    path: 'web-crawler-management',
    loadComponent: () =>
      import('../web-crawler-management/web-crawler-management.component').then(
        (c) => c.WebCrawlerManagementComponent,
      ),
    canMatch: [permissionGuard([PERMISSION.WebCrawlerManagement])],
  },
];
