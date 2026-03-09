import { AchieveTypes } from '../enums/achieve.enum';
import { Cell } from '@hunt-the-bishomalo/data';
import { Achievement } from '../models/achievement.model';
import { Signal } from '@angular/core';

export interface IAchievementService {
  achievements: Achievement[];
  completed: Signal<Achievement | undefined>;
  activeAchievement: (id: AchieveTypes) => void;
  caclVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
}
