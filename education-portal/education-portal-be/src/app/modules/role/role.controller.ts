import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  Authorize,
  PermissionsGuard,
} from 'src/app/infrastructures/auth';
import { PERMISSION } from 'src/app/infrastructures/constants';
import { PermissionDto } from '../permission/dtos';
import {
  CreateRoleRequestDto,
  RoleDto,
  UpdatePermissionRequestDto,
} from './dtos';
import { RoleService } from './role.service';

@ApiTags('role')
@Controller({
  path: 'roles',
})
export class RoleController {
  constructor(private roleService: RoleService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.AuthorizeManagement)
  @Get(':roleId/permissions')
  async getPermissionsByRole(
    @Param('roleId', new ParseIntPipe()) roleId: number,
  ): Promise<PermissionDto[]> {
    return await this.roleService.getPermissionsByRole(roleId);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.AuthorizeManagement)
  @Patch(':roleId/permissions')
  async updatePermissionsForRole(
    @Param('roleId', new ParseIntPipe()) roleId: number,
    @Body() request: UpdatePermissionRequestDto,
  ): Promise<void> {
    await this.roleService.updatePermissionsForRole(roleId, request);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.AuthorizeManagement, PERMISSION.UserManagement)
  @Get()
  async getListRole(): Promise<RoleDto[]> {
    return await this.roleService.getListRole();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.AuthorizeManagement)
  @Post()
  async createRole(@Body() request: CreateRoleRequestDto): Promise<void> {
    await this.roleService.createRole(request);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.AuthorizeManagement)
  @Delete(':roleId')
  async deleteRole(
    @Param('roleId', new ParseIntPipe()) roleId: number,
  ): Promise<void> {
    await this.roleService.deleteRole(roleId);
  }
}
