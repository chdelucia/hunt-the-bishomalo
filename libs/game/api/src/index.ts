import { InjectionToken } from '@angular/core';
import { GameStore, GameEngineService, KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';

export const GAME_STORE = new InjectionToken<typeof GameStore>('GAME_STORE');
export const GAME_ENGINE = new InjectionToken<typeof GameEngineService>('GAME_ENGINE');
export const KEYBOARD_MANAGER = new InjectionToken<typeof KeyboardManagerService>('KEYBOARD_MANAGER');

export * from '@hunt-the-bishomalo/game/data-access';
export * from '@hunt-the-bishomalo/game/feature';
export * from '@hunt-the-bishomalo/game/ui';
