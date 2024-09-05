import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  loadEnvironmentConfig,
  typeOrmConfigOptions,
} from './infrastructures/config';
import { InitializationModule } from './infrastructures/initialization';
import { EmployeeModule } from './modules/employee/employee.module';
import { FileModule } from './modules/file/file.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { WebCrawlerManagementModule } from './modules/web-crawler-management/web-crawler-management.module';

const featureModules = [
  UserModule,
  PermissionModule,
  RoleModule,
  EmployeeModule,
  FileModule,
  WebCrawlerManagementModule,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadEnvironmentConfig],
      envFilePath: `src/env/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(typeOrmConfigOptions),
    ...featureModules,
    InitializationModule,
  ],
})
export class AppModule {}
