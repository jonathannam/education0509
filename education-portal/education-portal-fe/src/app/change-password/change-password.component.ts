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
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangePasswordRequest } from '../shared/services';
import { TypedFormGroup } from '../shared/utils';
import { ChangePasswordStore } from './change-password.store';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NzInputModule, ReactiveFormsModule, NzFormModule, NzButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChangePasswordStore],
})
export class ChangePasswordComponent {
  readonly #nzMessage = inject(NzMessageService);
  readonly changePasswordStore = inject(ChangePasswordStore);
  readonly changePasswordForm: TypedFormGroup<ChangePasswordRequest> =
    new FormGroup({
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      oldPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

  submit(): void {
    if (this.changePasswordForm.invalid) {
      this.#nzMessage.warning('Please update all info!');
      return;
    }
    this.changePasswordStore.changePassword(
      this.changePasswordForm.getRawValue(),
    );
  }
}
