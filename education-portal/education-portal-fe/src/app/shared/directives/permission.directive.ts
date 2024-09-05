import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  Input,
  TemplateRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { PERMISSION } from '../consts';
import { AuthStore } from '../state';

@Directive({
  selector: '[appPermission]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class PermissionDirective {
  readonly #currentUser = inject(AuthStore).currentUser;
  readonly #ngIf = inject(NgIf);
  readonly #acceptPermissions = signal<PERMISSION[] | undefined>([]);
  readonly #cdr = inject(ChangeDetectorRef);
  @Input() set appPermission(value: PERMISSION[] | undefined) {
    this.#acceptPermissions.set(value);
  }

  @Input() set appPermissionElse(tmp: TemplateRef<any> | null) {
    this.#ngIf.ngIfElse = tmp;
  }

  constructor() {
    effect(() => {
      const acceptPermissions = this.#acceptPermissions();
      if (!acceptPermissions?.length) {
        this.#ngIf.ngIf = true;
      } else {
        this.#ngIf.ngIf = acceptPermissions.some((p) =>
          this.#currentUser()?.permissions.includes(p)
        );
      }
      this.#cdr.detectChanges();
    });
  }
}
