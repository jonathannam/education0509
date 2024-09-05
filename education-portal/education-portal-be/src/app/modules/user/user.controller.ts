import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  Authorize,
  PermissionsGuard,
} from 'src/app/infrastructures/auth';
import { PERMISSION } from 'src/app/infrastructures/constants';
import { PagingDto } from 'src/app/infrastructures/dtos';
import {
  AuthResponseDto,
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  GetListUserQueryParamsDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  UpdateActiveStatusUserResponseDto,
  UpdateUserRequestDto,
  UserDto,
} from './dtos';
import { ResetPasswordResponseDto } from './dtos/reset-password-response.dto';
import { UserService } from './user.service';
@ApiTags('user')
@Controller({
  path: 'users',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @Post('login')
  async login(@Body() user: LoginRequestDto): Promise<AuthResponseDto> {
    return await this.userService.login(user);
  }

  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @Post('refresh-token')
  async refreshToken(
    @Body() request: RefreshTokenRequestDto,
  ): Promise<AuthResponseDto> {
    return await this.userService.refreshToken(request);
  }

  @ApiOkResponse()
  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() body: ChangePasswordRequestDto,
    @Req() req,
  ): Promise<void> {
    return await this.userService.changePassword(body, req);
  }

  @ApiOkResponse()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UserManagement)
  @Post()
  async createUser(@Body() user: CreateUserRequestDto): Promise<void> {
    return await this.userService.createUser(user);
  }

  @ApiOkResponse({
    type: ResetPasswordResponseDto,
  })
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UserManagement)
  @Patch(':userId/reset-password')
  async resetPassword(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<ResetPasswordResponseDto> {
    return await this.userService.resetPassword(userId);
  }

  @ApiOkResponse({
    type: UpdateActiveStatusUserResponseDto,
  })
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UserManagement)
  @Patch(':userId/active-status')
  async updateActiveStatus(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Request() req,
  ): Promise<UpdateActiveStatusUserResponseDto> {
    return await this.userService.updateActiveStatusUser(userId, req);
  }

  @ApiOkResponse()
  @ApiBody({
    type: UpdateUserRequestDto,
  })
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UserManagement)
  @Patch(':userId')
  async updateUser(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Body() request: UpdateUserRequestDto,
  ): Promise<void> {
    return await this.userService.updateUser(userId, request);
  }

  @ApiOkResponse()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UserManagement)
  @Delete(':userId')
  async deleteUser(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<void> {
    return await this.userService.deleteUser(userId);
  }

  @ApiOkResponse({
    isArray: true,
    type: PagingDto<UserDto>,
  })
  @ApiQuery({
    name: 'username',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
  })
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.UserManagement)
  @Get()
  async getListUser(
    @Query() query: GetListUserQueryParamsDto,
  ): Promise<PagingDto<UserDto>> {
    return await this.userService.getListUser(query);
  }
}
