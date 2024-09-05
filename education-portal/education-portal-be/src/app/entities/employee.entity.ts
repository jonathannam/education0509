import { Column, Entity, OneToMany } from 'typeorm';
import { EntityBase } from './common/entity-base';
import { EmployeeLog } from './employee-log.entity';

@Entity()
export class Employee extends EntityBase {
  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  contactNumber: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => EmployeeLog, (log) => log.employee)
  logs: EmployeeLog[];
}
