import { GameSound } from '../models/game-sound.enum';

export interface IAnalyticsService {
  trackAchievementUnlocked: (id: string, title: string) => void;
}

export interface IGameSoundService {
  stop: () => void;
  playSound: (sound: GameSound, loop: boolean) => void;
}
