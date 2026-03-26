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
    return value ? JSON.parse(value) : null;
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
}

export interface IAnalyticsService {
  sendEvent(eventName: string, params?: Record<string, unknown>): void;
  trackAchievementUnlocked(id: string, title: string): void;
}

export const ANALYTICS_SERVICE_TOKEN = new InjectionToken<IAnalyticsService>('ANALYTICS_SERVICE_TOKEN');

@Injectable({ providedIn: 'root' })
export class AnalyticsService implements IAnalyticsService {
  sendEvent(eventName: string, params?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] Event: ${eventName}`, params);
  }

  trackAchievementUnlocked(id: string, title: string): void {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] Achievement Unlocked: ${id} (${title})`);
  }
}
