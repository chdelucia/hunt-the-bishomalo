import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MiniBusService {
  emit(event: string, detail: unknown) {
    (globalThis as any).__EVENT_STORE__ ??= {};
    (globalThis as any).__EVENT_STORE__[event] = detail;

    globalThis.dispatchEvent(new CustomEvent(event, { detail }));
  }

  listen(event: string, callback: (data: any) => void) {
    const existing = (globalThis as any).__EVENT_STORE__?.[event];

    if (existing) {
      callback(existing);
    }

    globalThis.addEventListener(event, (e: any) => {
      callback(e.detail);
    });
  }
}
