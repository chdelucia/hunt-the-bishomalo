import { AchieveTypes } from "../achieve.enum";
import { Cell } from "../cell.model";


export interface IAchievementService {
  activeAchievement: (id: AchieveTypes) => void;
  caclVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
}
