import { signal } from '@angular/core';
import { Achievement, AchieveTypes, IAchievementService } from '@hunt-the-bishomalo/achievements/api';

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
  calcVictoryAchieve: () => {
    // Mock implementation
  },
  handleWumpusKillAchieve: () => {
    // Mock implementation
  },
  isAllCompleted: () => {
    // Mock implementation
  },
};
