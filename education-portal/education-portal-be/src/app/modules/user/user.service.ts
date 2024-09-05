import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivationUserLog, Role, User } from 'src/app/entities';
import { AuthService } from 'src/app/infrastructures/auth';
import { PagingDto } from 'src/app/infrastructures/dtos';
import { generateRandomString } from 'src/app/infrastructures/utils';
import { ILike, Repository } from 'typeorm';
import {
  AuthResponseDto,
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  GetListUserQueryParamsDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  ResetPasswordResponseDto,
  UpdateActiveStatusUserResponseDto,
  UpdateUserRequestDto,
  UserDto,
} from './dtos';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ActivationUserLog)
    private activationUserLogRepository: Repository<ActivationUserLog>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async createUser(request: CreateUserRequestDto): Promise<void> {
    const userValidate = await this.userRepository.findOne({
      where: [{ username: request.username }],
    });
    if (userValidate) {
      throw new BadRequestException('Username must be unique');
    }
    const newUser = await this.userRepository.create({
      username: request.username,
      password: await this.authService.hashPassword(request.password),
    });

    const role = await this.roleRepository.findOne({
      where: { id: request.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role does not exist');
    }

    newUser.role = role;
    await this.userRepository.save(newUser);
  }

  async login(request: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          username: request.username,
        },
      ],
      relations: {
        role: {
          permissions: true,
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Username does not exist');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('The user account is currently inactive');
    }
    const isValidPassword = await this.authService.validatePassword(
      request.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.createRefreshToken(user);
    return {
      role: user.role.name,
      username: user.username,
      accessToken: accessToken,
      refreshToken: refreshToken.token,
      permissions: user.role.permissions.map((p) => p.name),
    };
  }

  async refreshToken(
    request: RefreshTokenRequestDto,
  ): Promise<AuthResponseDto> {
    const oldRefreshToken = await this.authService.verifyRefreshToken(
      request.token,
    );

    const user = await this.userRepository.findOne({
      where: {
        id: oldRefreshToken.user.id,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
    await this.authService.removeRefreshToken(oldRefreshToken);

    const accessToken = await this.authService.generateAccessToken(user.id);
    const newRefreshToken = await this.authService.createRefreshToken(user);

    const loginResponse: AuthResponseDto = {
      username: user.username,
      role: user.role.name,
      accessToken: accessToken,
      refreshToken: newRefreshToken.token,
      permissions: user.role.permissions.map((p) => p.name),
    };

    return loginResponse;
  }

  async updateUser(
    userId: number,
    request: UpdateUserRequestDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    user.username = request.username || user.username;
    const role = await this.roleRepository.findOne({
      where: { id: request.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role does not exist');
    }
    user.role = role;
    await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete({
      id: userId,
    });
  }

  async getListUser(
    query?: GetListUserQueryParamsDto,
  ): Promise<PagingDto<UserDto>> {
    const [users, totalCount] = await this.userRepository.findAndCount({
      where: {
        ...(query?.username && { username: ILike(`%${query.username}%`) }),
        ...(query?.role && { role: { name: query.role } }),
        ...(query?.isActive !== null &&
          query?.isActive !== undefined && { isActive: query.isActive }),
      },
      relations: {
        role: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (query.pageIndex - 1) * query.pageSize,
      take: query.pageSize,
    });
    return {
      items: users.map((user) => ({
        createdAt: user.createdAt,
        id: user.id,
        role: {
          id: user.role?.id,
          name: user.role?.name,
        },
        updatedAt: user.updatedAt,
        username: user.username,
        isActive: user.isActive,
      })),
      totalCount,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    };
  }

  async resetPassword(userId: number): Promise<ResetPasswordResponseDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const newPassword = generateRandomString(6);
    user.password = await this.authService.hashPassword(newPassword);
    await this.userRepository.save(user);
    return {
      newPassword,
    };
  }

  async updateActiveStatusUser(
    userId: number,
    request,
  ): Promise<UpdateActiveStatusUserResponseDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    const activeLog = this.activationUserLogRepository.create({
      isActive: user.isActive,
      author: {
        id: request['user'].id,
      },
    });
    await this.activationUserLogRepository.save(activeLog);
    return {
      isActive: user.isActive,
    };
  }

  async changePassword(body: ChangePasswordRequestDto, request): Promise<void> {
    const userId = request['user'].id;
    const currentUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const isValidPassword = await this.authService.validatePassword(
      body.oldPassword,
      currentUser.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Old password is incorrect');
    }
    currentUser.password = await this.authService.hashPassword(
      body.newPassword,
    );
    await this.userRepository.save(currentUser);
  }
}
