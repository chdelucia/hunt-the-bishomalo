import { signal } from '@angular/core';
import { Achievement } from '../models/achievements.model';
import { IAchievementService } from '../api/achievement-service.interface';

export const mockAchievementService: IAchievementService = {
  achievements: [
    {
      id: 'lara',
      title: 'Tomb Raider III',
      description: 'Desbloquea a Lara',
      unlocked: true,
      rarity: 'legendary',
      svgIcon: 'lara.png',
    },
  ],
  completed: signal<Achievement | undefined>(undefined),
  activeAchievement: () => {
    // Mock implementation
  },
  isAllCompleted: () => {
    // Mock implementation
  },
};
