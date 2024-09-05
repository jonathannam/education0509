import { inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';
import { AuthStore } from '../state';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  readonly #ngZone = inject(NgZone);
  readonly #authStore = inject(AuthStore);
  readonly #timeLimit = 5 * 60 * 1000;
  readonly #activityEvents$ = new Observable((observer) => {
    const events = ['mousemove', 'keydown', 'click'];
    const eventHandler = (event: Event) => observer.next(event);

    events.forEach((event) => document.addEventListener(event, eventHandler));

    return () =>
      events.forEach((event) =>
        document.removeEventListener(event, eventHandler),
      );
  }).pipe(
    filter((event) => event instanceof Event),
    throttleTime(1000),
  );
  #timeoutId!: number;

  startMonitoring() {
    this.#activityEvents$.subscribe(() => {
      this.#resetTimeout();
    });

    this.#resetTimeout();
  }

  #resetTimeout() {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
    }

    this.#ngZone.runOutsideAngular(() => {
      this.#timeoutId = window.setTimeout(() => {
        this.#ngZone.run(() => this.#authStore.logout());
      }, this.#timeLimit);
    });
  }
}
