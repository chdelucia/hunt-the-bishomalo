import { signal } from '@angular/core';
import { Achievement } from '@hunt-the-bishomalo/shared-data';
import { IAchievementService } from '@hunt-the-bishomalo/achievements/api';

export const mockAchievementService: IAchievementService = {
  achievements: signal<Achievement[]>([
    {
      id: 'lara',
      title: 'Tomb Raider III',
      description: 'Desbloquea a Lara',
      unlocked: true,
      rarity: 'legendary',
      svgIcon: 'lara.png',
    },
  ]),
  completed: signal<Achievement | undefined>(undefined),
  activeAchievement: () => {
    // Mock implementation
  },
  isAllCompleted: () => {
    // Mock implementation
  },
};
