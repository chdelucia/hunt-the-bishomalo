import { AchieveTypes, Cell } from '@hunt-the-bishomalo/data';

export interface IAchievementService {
  activeAchievement: (id: AchieveTypes) => void;
  caclVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
}
