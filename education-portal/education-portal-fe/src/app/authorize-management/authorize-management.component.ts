import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Permission } from '../shared/models';
import { AuthorizeManagementStore } from './authorize-management.store';

interface PermissionWithActiveStatus extends Permission {
  isActive: boolean;
}

@Component({
  selector: 'app-authorize-management',
  standalone: true,
  imports: [
    NzSwitchModule,
    NzButtonModule,
    NgClass,
    NzGridModule,
    FormsModule,
    NzModalModule,
    NzInputModule,
    NzIconModule,
    NzPopconfirmModule,
  ],
  templateUrl: './authorize-management.component.html',
  styleUrl: './authorize-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthorizeManagementStore],
})
export class AuthorizeManagementComponent {
  readonly authorizeManagementStore = inject(AuthorizeManagementStore);
  readonly listPermission = computed<PermissionWithActiveStatus[]>(() => {
    return this.authorizeManagementStore.listPermission().map((p) => ({
      ...p,
      isActive: this.authorizeManagementStore
        .listPermissionByRole()
        .some((pRole) => pRole.id === p.id),
    }));
  });
  isVisibleModal = false;
  newRoleName = '';

  closeModal(): void {
    this.newRoleName = '';
    this.isVisibleModal = false;
  }

  handleOk(): void {
    this.authorizeManagementStore
      .createRole(this.newRoleName)
      .subscribe(() => this.closeModal());
  }
}
