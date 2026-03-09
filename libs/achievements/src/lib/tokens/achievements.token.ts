import { InjectionToken } from '@angular/core';
import { IAchievementService } from '../interfaces/achievement-service.interface';

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');
