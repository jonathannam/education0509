import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/app/entities';
import { Repository } from 'typeorm';
import { PermissionDto } from './dtos';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getPermissions(): Promise<PermissionDto[]> {
    const listPermissions = await this.permissionRepository.find();
    return listPermissions.map((permission) => ({
      name: permission.name,
      id: permission.id,
    }));
  }
}
