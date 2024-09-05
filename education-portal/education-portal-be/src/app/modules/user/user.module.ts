import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivationUserLog, Role, User } from 'src/app/entities';
import { AuthModule } from 'src/app/infrastructures/auth';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, ActivationUserLog, Role]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
