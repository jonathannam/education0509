import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  Authorize,
  PermissionsGuard,
} from 'src/app/infrastructures/auth';
import { EMPLOYEE_STATUS, PERMISSION } from 'src/app/infrastructures/constants';
import { PagingDto } from 'src/app/infrastructures/dtos';
import {
  EmployeeDto,
  GetListEmployeeParamsDto,
  UpsertEmployeeRequestDto,
} from './dtos';
import { EmployeeService } from './employee.service';

@ApiTags('employee')
@Controller({
  path: 'employees',
})
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.EmployeeManagement)
  create(@Body() createEmployeeDto: UpsertEmployeeRequestDto): Promise<void> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.EmployeeManagement)
  getList(
    @Query() query: GetListEmployeeParamsDto,
  ): Promise<PagingDto<EmployeeDto>> {
    return this.employeeService.getListEmployee(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number): Promise<EmployeeDto> {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.EmployeeManagement)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpsertEmployeeRequestDto,
  ): Promise<void> {
    return this.employeeService.update(id, body);
  }

  @Patch(':id/terminate')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.EmployeeManagement)
  terminate(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.employeeService.updateEmployeeStatus(
      id,
      EMPLOYEE_STATUS.Terminated,
    );
  }

  @Patch(':id/inactivate')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.EmployeeManagement)
  inactivate(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.employeeService.updateEmployeeStatus(
      id,
      EMPLOYEE_STATUS.Inactive,
    );
  }

  @Patch(':id/activate')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Authorize(PERMISSION.EmployeeManagement)
  activate(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.employeeService.updateEmployeeStatus(
      id,
      EMPLOYEE_STATUS.Active,
    );
  }
}
