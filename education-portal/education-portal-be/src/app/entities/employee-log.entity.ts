import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './common/entity-base';
import { Employee } from './employee.entity';

@Entity()
export class EmployeeLog extends EntityBase {
  @ManyToOne(() => Employee, (employee) => employee.logs)
  employee: Employee;

  @Column()
  action: string;

  @Column('text')
  changes: string;
}
