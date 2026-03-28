import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IdlePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data?.['preload'] === true) {
      return new Observable((observer) => {
        const loadRoute = () => {
          load().subscribe({
            next: (val) => observer.next(val),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
        };

        if ('requestIdleCallback' in globalThis) {
          (globalThis as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void }).requestIdleCallback(
            loadRoute,
            { timeout: 3000 },
          );
        } else {
          globalThis.setTimeout(loadRoute, 3000);
        }
      });
    }
    return of(null);
  }
}
