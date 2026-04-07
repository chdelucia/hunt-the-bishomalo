import { Injectable, InjectionToken } from '@angular/core';

export interface ILocalstorageService {
  getValue<T>(key: string): T | null;
  setValue<T>(key: string, value: T): void;
  clearValue(key: string): void;
  clearAll(): void;
}

export const LOCALSTORAGE_SERVICE_TOKEN = new InjectionToken<ILocalstorageService>('LOCALSTORAGE_SERVICE_TOKEN');

@Injectable({ providedIn: 'root' })
export class LocalstorageService implements ILocalstorageService {
  getValue<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }

    try {
      const parsed = JSON.parse(value);
      return this.sanitize(parsed);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error parsing localStorage key: ' + key, e);
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

export interface IAnalyticsService {
  sendEvent(eventName: string, params?: Record<string, unknown>): void;
  trackAchievementUnlocked(id: string, title: string): void;
}

export const ANALYTICS_SERVICE_TOKEN = new InjectionToken<IAnalyticsService>('ANALYTICS_SERVICE_TOKEN');

@Injectable({ providedIn: 'root' })
export class AnalyticsService implements IAnalyticsService {
  sendEvent(eventName: string, params?: Record<string, unknown>): void {
    console.log(`[Analytics] Event: ${eventName}`, params);
  }

  trackAchievementUnlocked(id: string, title: string): void {
    console.log(`[Analytics] Achievement Unlocked: ${id} (${title})`);
  }
}
