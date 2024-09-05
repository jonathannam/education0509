import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, Role, User } from 'src/app/entities';
import { In, Repository } from 'typeorm';
import { AuthService } from '../auth';
import { PERMISSION } from '../constants';

const SYSTEM_ADMIN_ROLE = 'System Admin';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  async onModuleInit() {
    await this.syncPermission();
    await this.generateRole();
    await this.createAdminUser();
  }

  private async syncPermission(): Promise<void> {
    const definedPermissions = Object.values(PERMISSION) as string[];
    const existingPermissions = await this.permissionRepository.find();
    const existingPermissionNames = existingPermissions.map((p) => p.name);

    const permissionsToAdd = definedPermissions.filter(
      (p) => !existingPermissionNames.includes(p),
    );
    const permissionsToRemove = existingPermissions.filter(
      (p) => !definedPermissions.includes(p.name),
    );

    for (const permissionName of permissionsToAdd) {
      const permission = new Permission();
      permission.name = permissionName;
      await this.permissionRepository.save(permission);
    }

    for (const permission of permissionsToRemove) {
      await this.permissionRepository.remove(permission);
    }
  }

  private async generateRole(): Promise<void> {
    let systemAdminRole = await this.roleRepository.findOne({
      where: {
        name: SYSTEM_ADMIN_ROLE,
      },
      relations: {
        permissions: true,
      },
    });
    if (!systemAdminRole) {
      systemAdminRole = await this.roleRepository.create({
        name: SYSTEM_ADMIN_ROLE,
      });
    }
    if (!systemAdminRole.permissions?.length) {
      const listPermissionOfSystemAdmin = await this.permissionRepository.find({
        where: {
          name: In([PERMISSION.AuthorizeManagement, PERMISSION.UserManagement]),
        },
      });
      systemAdminRole.permissions = listPermissionOfSystemAdmin;
      await this.roleRepository.save(systemAdminRole);
    }
  }

  private async createAdminUser(): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        role: {
          name: SYSTEM_ADMIN_ROLE,
        },
      },
    });
    if (!user) {
      const adminRole = await this.roleRepository.findOne({
        where: {
          name: SYSTEM_ADMIN_ROLE,
        },
      });
      const newAdmin = await this.userRepository.create({
        username: 'system.admin',
        password: await this.authService.hashPassword('123456'),
        role: adminRole,
      });
      await this.userRepository.save(newAdmin);
    }
  }
}
