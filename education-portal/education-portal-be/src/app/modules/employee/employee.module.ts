import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/app/entities';
import { EmployeeLog } from 'src/app/entities/employee-log.entity';
import { EmployeeController } from './employee.controler';
import { EmployeeService } from './employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, EmployeeLog])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
