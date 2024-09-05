import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, User } from 'src/app/entities';
import { AuthModule } from '../auth';
import { InitializationService } from './initialization.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [InitializationService],
})
export class InitializationModule {}
