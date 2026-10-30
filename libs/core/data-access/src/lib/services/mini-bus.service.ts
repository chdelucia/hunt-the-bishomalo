import { Injectable, signal, Signal } from '@angular/core';
import { IMiniBusService } from '@hunt-the-bishomalo/core/api';

@Injectable({ providedIn: 'root' })
export class MiniBusService implements IMiniBusService {
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

  listenSignal<T>(event: string): Signal<T | undefined> {
    if (this.forbiddenKeys.includes(event)) {
      return signal<T | undefined>(undefined).asReadonly();
    }
    const existing = (globalThis as any).__EVENT_STORE__?.[event];
    const sig = signal<T | undefined>(existing);
    this.listen(event, (data) => sig.set(data));
    return sig.asReadonly();
  }
}
