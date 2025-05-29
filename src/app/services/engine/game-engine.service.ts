import { inject, Injectable } from '@angular/core';
import { GameStore } from '../../store/game-store';
import { GameSettings, Cell } from '../../models';

import { BoardSetupService } from './board-setup.service';
import { PlayerActionService } from './player-action.service';
import { GameRulesService } from './game-rules.service';
import { LevelManagementService } from './level-management.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private store = inject(GameStore);
  private boardSetupService = inject(BoardSetupService);
  private playerActionService = inject(PlayerActionService);
  private gameRulesService = inject(GameRulesService);
  private levelManagementService = inject(LevelManagementService);

  constructor() {}

  initGame(config: GameSettings): void {
    this.levelManagementService.initGame(config);
    this.gameRulesService.checkCurrentCell(0, 0); 
  }

  nextLevel(): void {
    this.levelManagementService.nextLevel();
    this.gameRulesService.checkCurrentCell(0, 0);
  }

  restartLevel(): void {
    this.levelManagementService.restartLevel();
    this.gameRulesService.checkCurrentCell(0, 0); 
  }

  newGame(): void {
    this.levelManagementService.newGame();
  }

  moveForward(): void {
    const { x: oldX, y: oldY } = this.store.hunter();
    this.playerActionService.moveForward();
    if (this.store.hunter().alive && !this.store.hunter().hasWon) {
        this.gameRulesService.checkCurrentCell(oldX, oldY);
    }
  }

  turnLeft(): void {
    this.playerActionService.turnLeft();
  }

  turnRight(): void {
    this.playerActionService.turnRight();
  }

  shootArrow(): void {
    this.playerActionService.shootArrow(); 
  }

  exitGame(): void {
    if (this.levelManagementService.canExitWithVictory()) {
      this.levelManagementService.exitGame();
    }
  }

  public getPerceptionMessage(): string {
    return this.gameRulesService.getPerceptionMessage();
  }
}
