import { signal } from '@angular/core';
import { Achievement, IAchievementService } from '@hunt-the-bishomalo/data';

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
