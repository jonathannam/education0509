import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role } from 'src/app/entities';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
