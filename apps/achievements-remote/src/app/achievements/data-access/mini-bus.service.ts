import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MiniBusService {
  private readonly forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

  emit(event: string, detail: unknown) {
    if (this.forbiddenKeys.includes(event)) {
      return;
    }

    (globalThis as any).__EVENT_STORE__ ??= Object.create(null);
    (globalThis as any).__EVENT_STORE__[event] = detail;

    globalThis.dispatchEvent(new CustomEvent(event, { detail }));
  }

  listen(event: string, callback: (data: any) => void) {
    if (this.forbiddenKeys.includes(event)) {
      return;
    }

    const existing = (globalThis as any).__EVENT_STORE__?.[event];

    if (existing) {
      callback(existing); // replay
    }

    globalThis.addEventListener(event, (e: any) => {
      callback(e.detail);
    });
  }
}
