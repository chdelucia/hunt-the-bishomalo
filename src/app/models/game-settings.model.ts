import { Chars } from './hunter.model';

export interface GameSettings {
  size: number;
  pits: number;
  arrows: number;
  player: string;
  wumpus: number;
  blackout?: boolean;
  selectedChar: Chars;
  difficulty: GameDificulty;
}

export interface GameDificulty {
  maxLevels: number;
  maxChance: number;
  gold: number;
  maxLives: number;
  baseChance: number;
  luck: number;
}

export enum DifficultyTypes {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
}

export const DIFFICULTY_CONFIGS: Record<DifficultyTypes, GameDificulty> = {
  easy: {
    maxLevels: 10,
    maxChance: 0.35,
    baseChance: 0.12,
    gold: 60,
    maxLives: 8,
    luck: 8,
  },
  normal: {
    maxLevels: 15,
    maxChance: 0.3,
    baseChance: 0.11,
    gold: 50,
    maxLives: 8,
    luck: 5,
  },
  hard: {
    maxLevels: 15,
    baseChance: 0.1,
    maxChance: 0.25,
    gold: 50,
    maxLives: 5,
    luck: 0,
  },
};
