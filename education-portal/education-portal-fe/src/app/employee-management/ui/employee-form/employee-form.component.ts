import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Employee } from '../../../shared/models';
import { UpsertEmployeeRequest } from '../../../shared/services';
import { TypedFormGroup } from '../../../shared/utils';
import { EmployeeManagementStore } from '../../employee-management.store';
import { EmployeeFormStore } from './employee-form.store';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EmployeeFormStore],
})
export class EmployeeFormComponent implements OnInit {
  readonly #employeeManagementStore: InstanceType<
    typeof EmployeeManagementStore
  > = inject(NZ_MODAL_DATA).employeeManagementStore;
  readonly #updatedEmployee: Employee = inject(NZ_MODAL_DATA).updatedEmployee;
  readonly modalRef = inject(NzModalRef);
  readonly employeeFormStore = inject(EmployeeFormStore);
  readonly form: TypedFormGroup<UpsertEmployeeRequest> = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    position: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    contactNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    if (this.#updatedEmployee) {
      this.form.setValue({
        address: this.#updatedEmployee.address,
        contactNumber: this.#updatedEmployee.contactNumber,
        department: this.#updatedEmployee.department,
        email: this.#updatedEmployee.email,
        name: this.#updatedEmployee.name,
        position: this.#updatedEmployee.position,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    if (this.#updatedEmployee) {
      this.#updateEmployee();
    } else {
      this.#createEmployee();
    }
  }

  #updateEmployee(): void {
    this.employeeFormStore.updateEmployee({
      id: this.#updatedEmployee.id,
      request: this.form.getRawValue(),
      employeeManagementStore: this.#employeeManagementStore,
    });
  }

  #createEmployee(): void {
    this.employeeFormStore.createEmployee({
      request: this.form.getRawValue(),
      employeeManagementStore: this.#employeeManagementStore,
    });
  }
}
