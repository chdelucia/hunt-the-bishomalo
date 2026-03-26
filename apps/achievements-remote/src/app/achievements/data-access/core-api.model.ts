import { InjectionToken } from '@angular/core';

export interface ILocalstorageService {
  getValue<T>(key: string): T | null;
  setValue<T>(key: string, value: T): void;
  clearValue(key: string): void;
  clearAll(): void;
}

export const LOCALSTORAGE_SERVICE_TOKEN = new InjectionToken<ILocalstorageService>('LOCALSTORAGE_SERVICE_TOKEN');

export interface IAnalyticsService {
  sendEvent(eventName: string, params?: Record<string, unknown>): void;
  trackAchievementUnlocked(id: string, title: string): void;
}

export const ANALYTICS_SERVICE_TOKEN = new InjectionToken<IAnalyticsService>('ANALYTICS_SERVICE_TOKEN');
