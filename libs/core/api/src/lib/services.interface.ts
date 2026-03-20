import { InjectionToken, Signal } from '@angular/core';
import { GameSound, CauseOfDeath, Cell } from '@hunt-the-bishomalo/data';

export interface IGameSoundService {
  playSound(sound: GameSound, loop?: boolean): void;
  stop(): void;
  stopWumpus(): void;
}

export const GAME_SOUND_TOKEN = new InjectionToken<IGameSoundService>('GAME_SOUND_TOKEN');

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

export interface IGameEventService {
  applyEffectsOnDeath(cause: CauseOfDeath, cell: Cell, prev: { x: number; y: number }): boolean;
  applyEffectByCellContent(cell: Cell): void;
}

export const GAME_EVENT_SERVICE_TOKEN = new InjectionToken<IGameEventService>('GAME_EVENT_SERVICE_TOKEN');
