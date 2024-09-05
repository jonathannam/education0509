import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EMPLOYEE_STATUS } from '../shared/consts';
import { Employee, SelectOption } from '../shared/models';
import { EmployeeManagementStore } from './employee-management.store';
import { EmployeeFormComponent } from './ui/employee-form/employee-form.component';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    FormsModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzModalModule,
  ],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EmployeeManagementStore],
})
export class EmployeeManagementComponent {
  readonly #modalService = inject(NzModalService);
  readonly employeeManagementStore = inject(EmployeeManagementStore);
  readonly EMPLOYEE_STATUS = EMPLOYEE_STATUS;
  readonly employeeStatusOptions: SelectOption<EMPLOYEE_STATUS>[] = [
    { value: EMPLOYEE_STATUS.Active, label: 'Active' },
    { value: EMPLOYEE_STATUS.Inactive, label: 'Inactive' },
    { value: EMPLOYEE_STATUS.Terminated, label: 'Terminated' },
  ];

  nameFilter?: string;
  positionFilter?: string;
  statusFilter?: EMPLOYEE_STATUS;

  constructor() {
    effect(() => {
      const queryParams = this.employeeManagementStore.queryParams();
      if (this.positionFilter !== queryParams.position) {
        this.positionFilter = queryParams.position;
      }
      if (this.statusFilter !== queryParams.status) {
        this.statusFilter = queryParams.status;
      }
      if (this.nameFilter !== queryParams.name) {
        this.nameFilter = queryParams.name;
      }
    });
  }

  openCreateEmployeeModal() {
    this.#modalService.create({
      nzTitle: 'Create Employee',
      nzFooter: null,
      nzContent: EmployeeFormComponent,
      nzData: {
        employeeManagementStore: this.employeeManagementStore,
      },
      nzWidth: '600px'
    });
  }

  openUpdateEmployeeModal(employee: Employee) {
    this.#modalService.create({
      nzTitle: 'Update Employee',
      nzFooter: null,
      nzContent: EmployeeFormComponent,
      nzData: {
        employeeManagementStore: this.employeeManagementStore,
        updatedEmployee: employee,
      },
      nzWidth: '600px'
    });
  }
}
