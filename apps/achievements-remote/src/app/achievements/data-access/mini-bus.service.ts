import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MiniBusService {
  private readonly forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

  private ensureEventStore(): void {
    const global = globalThis as any;
    if (!global.__EVENT_STORE__ || Object.getPrototypeOf(global.__EVENT_STORE__) !== null) {
      const existingStore = global.__EVENT_STORE__;
      const newStore = Object.create(null);

      if (existingStore) {
        Object.keys(existingStore).forEach((key) => {
          if (!this.forbiddenKeys.includes(key)) {
            newStore[key] = existingStore[key];
          }
        });
      }

      Object.defineProperty(global, '__EVENT_STORE__', {
        value: newStore,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }
  }

  emit(event: string, detail: unknown) {
    if (this.forbiddenKeys.includes(event)) {
      return;
    }

    this.ensureEventStore();
    (globalThis as any).__EVENT_STORE__[event] = detail;

    globalThis.dispatchEvent(new CustomEvent(event, { detail }));
  }

  listen(event: string, callback: (data: any) => void) {
    if (this.forbiddenKeys.includes(event)) {
      return;
    }

    this.ensureEventStore();
    const existing = (globalThis as any).__EVENT_STORE__[event];

    if (existing) {
      callback(existing); // replay
    }

    globalThis.addEventListener(event, (e: any) => {
      callback(e.detail);
    });
  }
}
