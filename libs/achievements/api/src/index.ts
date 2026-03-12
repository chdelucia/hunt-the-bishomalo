import { InjectionToken, Signal } from '@angular/core';
import { Cell } from '@hunt-the-bishomalo/data';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  svgIcon: string;
  unlocked: boolean;
  rarity: string;
  date?: string;
}

export enum AchieveTypes {
  WUMPUSKILLED = 'kill_wumpus',
  WRAT = 'escape_rat',
  PICKARROW = 'collect_arrow',
  PICKHEART = 'collect_heart',
  PICKBALLS = 'collect_dragonballs',
  WINHERO = 'hero_escape',
  BLACKOUT = 'survive_blackout',
  WINBLACKWOUT = 'survive_blackout_complete',
  DEATHBYWUMPUES = 'death_by_wumpus',
  DEATHBYPIT = 'death_by_pit',
  PICKGOLD = 'collect_gold',
  DEATHBYBLACKOUT = 'death_during_blackout',
  HARDHEAD = 'hard_head',
  WINLARGEMAP = 'large_map_completion',
  MISSEDSHOT = 'missed_last_arrow',
  WASTEDARROWS = 'wasted_arrows',
  SPEEDRUNNER = 'speedrunner',
  GAMER = 'true_gamer',
  BLINDWUMPUSKILLED = 'blind_shot',
  NOVICECARTO = 'novice_cartographer',
  EXPERTCARTO = 'expert_cartographer',
  DEATHDUEL = 'death_duel',
  SNIPER = 'sniper',
  LASTBREATH = 'last_breath',
  FINAL = 'completionist',
  JEDI = 'secret',
  PENTA = 'pentakill',
  LEGOLAS = 'legolas',
  LINK = 'link',
  LARA = 'lara',
}

export interface IAchievementService {
  achievements: Achievement[];
  completed: Signal<Achievement | undefined>;
  activeAchievement: (id: AchieveTypes | string) => void;
  calcVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
  isAllCompleted: () => void;
}

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');
