import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameStore } from '../../store/game-store';
import { GameSoundService } from '../sound/game-sound.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { BoardSetupService } from './board-setup.service';
import { GameSettings, GameSound, RouteTypes } from '../../models';
import * as gameRulesUtils from '../../utils/game-rules.utils';

@Injectable({ providedIn: 'root' })
export class LevelManagementService {
  store = inject(GameStore);
  sound = inject(GameSoundService);
  leaderBoard = inject(LeaderboardService);
  router = inject(Router);
  boardSetupService = inject(BoardSetupService);

  private readonly _settings = this.store.settings;
  private readonly _hunter = this.store.hunter;

  constructor() {}

  public initGame(config: GameSettings): void {
    this.sound.stop();
    this.store.setSettings(config);
    this.boardSetupService.initializeGameBoard();
  }

  public nextLevel(): void {
    const currentSettings = this._settings();
    const { size, difficulty } = currentSettings;
    const newSize = size + 1;

    const newSettings: GameSettings = {
      ...currentSettings,
      size: newSize,
      pits: gameRulesUtils.calculatePitsForLevel(newSize, difficulty.luck),
      wumpus: gameRulesUtils.calculateWumpusForLevel(newSize, difficulty.luck),
      blackout: gameRulesUtils.shouldApplyBlackoutOnLevelChange(),
    };
    this.store.setSettings(newSettings);
    this.boardSetupService.initializeGameBoard();
  }

  public restartLevel(): void {
    this.sound.stop();
    this.boardSetupService.initializeGameBoard();
  }

  public newGame(): void {
    this.sound.stop();
    this.store.resetHunter();
    this.store.setSettings({} as GameSettings); 
    this.leaderBoard.clear();
  }

  public exitGame(): void { 
    this.sound.stop();
    this.handleVictory();
  }

  public canExitWithVictory(): boolean {
    const hunter = this._hunter();
    const cell = this.store.currentCell(); 
    return cell.x === 0 && cell.y === 0 && hunter.hasGold;
  }

  private handleVictory(): void {
    let goldBonus = 0;
    if (this._settings().blackout) {
      goldBonus = 200;
    }

    this.store.setMessage(this.store.message() + ' ' + 'Victory!');
    this.store.updateHunter({ hasWon: true, gold: this._hunter().gold + goldBonus });
    this.playVictorySound();
  }

  private playVictorySound(): void {
    const settings = this._settings();
    if (settings.size === settings.difficulty.maxLevels + 3) {
      this.sound.playSound(GameSound.FINISH, false);
    } else {
      this.sound.playSound(GameSound.WHONOR, false);
    }
  }
}
