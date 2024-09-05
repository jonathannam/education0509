import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  Authorize,
  PermissionsGuard,
} from 'src/app/infrastructures/auth';
import { PERMISSION } from 'src/app/infrastructures/constants';
import { PermissionDto } from './dtos';
import { PermissionService } from './permission.service';
@ApiTags('permission')
@Controller({
  path: 'permissions',
})
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.AuthorizeManagement)
  @Get()
  async getPermission(): Promise<PermissionDto[]> {
    return await this.permissionService.getPermissions();
  }
}
