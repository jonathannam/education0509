import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee, EmployeeLog } from 'src/app/entities';
import {
  EMPLOYEE_LOG_ACTION,
  EMPLOYEE_STATUS,
} from 'src/app/infrastructures/constants';
import { PagingDto } from 'src/app/infrastructures/dtos';
import { ILike, Repository } from 'typeorm';
import { EmployeeDto, UpsertEmployeeRequestDto } from './dtos';
import { GetListEmployeeParamsDto } from './dtos/get-list-employee-params.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeLog)
    private readonly employeeLogRepository: Repository<EmployeeLog>,
  ) {}

  async create(createEmployeeDto: UpsertEmployeeRequestDto): Promise<void> {
    const employee = this.employeeRepository.create(createEmployeeDto);
    await this.employeeRepository.save(employee);
    await this.employeeLogRepository.save({
      action: EMPLOYEE_LOG_ACTION.Create,
      changes: JSON.stringify(employee),
    });
  }

  async getListEmployee(
    query?: GetListEmployeeParamsDto,
  ): Promise<PagingDto<EmployeeDto>> {
    const [employees, totalCount] = await this.employeeRepository.findAndCount({
      where: {
        ...(query?.name && { name: ILike(`%${query.name}%`) }),
        ...(query?.position && { position: ILike(`%${query.position}%`) }),
        ...(query?.status && { status: query.status }),
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (query.pageIndex - 1) * query.pageSize,
      take: query.pageSize,
    });

    const employeeDtos = employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      address: employee.address,
      email: employee.email,
      contactNumber: employee.contactNumber,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));

    return {
      items: employeeDtos,
      totalCount,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    };
  }

  async findOne(id: number): Promise<EmployeeDto> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return {
      id: employee.id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      address: employee.address,
      email: employee.email,
      contactNumber: employee.contactNumber,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  async update(
    id: number,
    updateEmployeeDto: UpsertEmployeeRequestDto,
  ): Promise<void> {
    const employee = await this.employeeRepository.preload({
      id: +id,
      ...updateEmployeeDto,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.save(employee);
    await this.employeeLogRepository.save({
      action: EMPLOYEE_LOG_ACTION.Update,
      changes: JSON.stringify(employee),
    });
  }

  async updateEmployeeStatus(
    id: number,
    status: EMPLOYEE_STATUS,
  ): Promise<void> {
    const employee = await this.findOne(id);
    employee.status = status;
    await this.employeeRepository.save(employee);
    await this.employeeLogRepository.save({
      action: EMPLOYEE_LOG_ACTION.Update,
      changes: JSON.stringify(employee),
    });
  }
}
