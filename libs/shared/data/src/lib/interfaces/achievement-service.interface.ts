import { AchieveTypes } from '../achieve.enum';
import { Cell } from '../cell.model';
import { Achievement } from '../achive.model';
import { Signal } from '@angular/core';

export interface IAchievementService {
  achievements: Achievement[];
  completed: Signal<Achievement | undefined>;
  activeAchievement: (id: AchieveTypes) => void;
  caclVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
}
