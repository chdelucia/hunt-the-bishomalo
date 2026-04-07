import { Injectable, isDevMode } from '@angular/core';
import { ILocalstorageService } from '@hunt-the-bishomalo/core/api';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService implements ILocalstorageService {
  getValue<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      return this.sanitize(parsed);
    } catch (e) {
      if (isDevMode()) console.log(e);
      return null;
    }
  }

  setValue<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  clearValue(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }

  private sanitize<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((v) => this.sanitize(v)) as unknown as T;
    }

    const sanitized = Object.create(null);
    const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && !forbiddenKeys.includes(key)) {
        sanitized[key] = this.sanitize((obj as any)[key]);
      }
    }

    return sanitized;
  }
}
