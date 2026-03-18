import { signal } from '@angular/core';
import { Achievement, AchieveTypes } from '@hunt-the-bishomalo/data';
import { IAchievementService } from '@hunt-the-bishomalo/achievements/api';

export const achievementServiceMock: IAchievementService = {
  achievements: [],
  completed: signal<Achievement | undefined>(undefined),
  activeAchievement: (_id: AchieveTypes | string) => {
    // Mock implementation for testing
  },
};
