import { InjectionToken } from '@angular/core';
import { IAnalyticsService, IGameSoundService } from './services.interfaces';

export const ANALYTICS_SERVICE_TOKEN = new InjectionToken<IAnalyticsService>('ANALYTICS_SERVICE');

export const GAME_SOUND_TOKEN = new InjectionToken<IGameSoundService>('GAME_SOUND');
