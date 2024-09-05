import { PERMISSION } from './permission';

interface Menu {
  url: string;
  title: string;
  acceptPermissions?: PERMISSION[];
}
export const MENU: Menu[] = [
  {
    url: '/user-management',
    title: 'User management',
    acceptPermissions: [PERMISSION.UserManagement],
  },
  {
    url: '/authorize-management',
    title: 'Authorize management',
    acceptPermissions: [PERMISSION.AuthorizeManagement],
  },
  {
    url: '/employee-management',
    title: 'Employee management',
    acceptPermissions: [PERMISSION.EmployeeManagement],
  },
  {
    url: '/operation-management',
    title: 'Operation management',
    acceptPermissions: [PERMISSION.OperationManagement],
  },
  {
    url: '/web-crawler-management',
    title: 'Web Crawler Management',
    acceptPermissions: [PERMISSION.WebCrawlerManagement],
  }
];
