import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, Role } from 'src/app/entities';
import { In, Repository } from 'typeorm';
import { PermissionDto } from '../permission/dtos';
import {
  CreateRoleRequestDto,
  RoleDto,
  UpdatePermissionRequestDto,
} from './dtos';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getListRole(): Promise<RoleDto[]> {
    const listRole = await this.roleRepository.find();
    return listRole.map((role) => ({ name: role.name, id: role.id }));
  }

  async createRole(request: CreateRoleRequestDto): Promise<void> {
    const role = await this.roleRepository.create({ name: request.name });
    await this.roleRepository.save(role);
  }

  async deleteRole(roleId: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    await this.roleRepository.remove(role);
  }

  async getPermissionsByRole(roleId: number): Promise<PermissionDto[]> {
    const listPermissions = await this.permissionRepository.find({
      where: {
        roles: {
          id: roleId,
        },
      },
    });
    return listPermissions.map((permission) => ({
      name: permission.name,
      id: permission.id,
    }));
  }

  async updatePermissionsForRole(
    roleId: number,
    request: UpdatePermissionRequestDto,
  ): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permissions = await this.permissionRepository.findBy({
      id: In(request.permissionIds),
    });

    role.permissions = permissions;
    await this.roleRepository.save(role);
  }
}
