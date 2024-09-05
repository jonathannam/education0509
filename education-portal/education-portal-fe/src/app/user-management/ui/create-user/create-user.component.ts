import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { CreateUserRequest } from '../../../shared/services';
import { TypedFormGroup } from '../../../shared/utils';
import { UserManagementStore } from '../../user-management.store';
import { CreateUserStore } from './create-user.store';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateUserStore],
})
export class CreateUserComponent {
  readonly #userManagementStore: InstanceType<typeof UserManagementStore> =
    inject(NZ_MODAL_DATA).userManagementStore;
  readonly modalRef = inject(NzModalRef);
  readonly createUserStore = inject(CreateUserStore);
  readonly roleOptions = this.#userManagementStore.roleOptions();
  readonly form: TypedFormGroup<CreateUserRequest> = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(6)],
    }),
    roleId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

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
    this.createUserStore.createUser({
      request: this.form.getRawValue(),
      userManagementStore: this.#userManagementStore,
    });
  }
}
