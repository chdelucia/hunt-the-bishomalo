import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MiniBusService {
  emit(event: string, detail: unknown) {
    (window as any).__EVENT_STORE__ ??= {};
    (window as any).__EVENT_STORE__[event] = detail;

    window.dispatchEvent(new CustomEvent(event, { detail }));
  }

  listen(event: string, callback: (data: any) => void) {
    const existing = (window as any).__EVENT_STORE__?.[event];

    if (existing) {
      callback(existing); // replay
    }

    window.addEventListener(event, (e: any) => {
      callback(e.detail);
    });
  }
}
