import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { GameStore } from '../../store/game-store';
import { GameSoundService } from '../sound/game-sound.service';
import { AchievementService } from '../achievement/achievement.service';
import { Cell, Direction, RouteTypes, AchieveTypes, GameSound } from '../../models';
import * as gridUtils from '../../utils/grid.utils';

@Injectable({ providedIn: 'root' })
export class PlayerActionService {
  store = inject(GameStore);
  sound = inject(GameSoundService);
  achieve = inject(AchievementService);
  router = inject(Router);
  transloco = inject(TranslocoService);

  private readonly _settings = this.store.settings;
  private readonly _hunter = this.store.hunter;

  constructor() {}

  public moveForward(): void {
    this.sound.stop();
    const { x, y, direction, alive, hasWon } = this._hunter();
    if (!alive || hasWon) return;

    const settings = this._settings();
    const size = settings.size;
    let newX = x,
      newY = y;

    switch (direction) {
      case Direction.UP:
        newX--; 
        break;
      case Direction.DOWN:
        newX++;
        break;
      case Direction.LEFT:
        newY--;
        break;
      case Direction.RIGHT:
        newY++;
        break;
    }
    
    this.checkSecret(size, newX, newY);
    
    const currentPosition = {x, y};
    const nextCalculatedPosition = gridUtils.getNextPosition(currentPosition.x, currentPosition.y, direction);
    newX = nextCalculatedPosition.x;
    newY = nextCalculatedPosition.y;

    if (!gridUtils.isInBounds(newX, newY, size)) {
      const wallCollisionMessage = this.transloco.translate('gameMessages.wallCollision');
      if (this.store.message() === wallCollisionMessage) {
        this.achieve.activeAchievement(AchieveTypes.HARDHEAD);
      }
      this.store.setMessage(wallCollisionMessage);
      this.sound.playSound(GameSound.HITWALL, false);
      return;
    }

    this.store.updateHunter({ x: newX, y: newY });
  }

  private checkSecret(size: number, x: number, y: number): void {
    if (size === 8 && x === 7 && y === 8) { 
      this.router.navigate([RouteTypes.JEDI], {
        state: {
          fromSecretPath: true,
        },
      });
    }
  }

  public turnLeft(): void {
    const dir = (this._hunter().direction + 3) % 4;
    this.store.updateHunter({ direction: dir });
  }

  public turnRight(): void {
    const dir = (this._hunter().direction + 1) % 4;
    this.store.updateHunter({ direction: dir });
  }

  public shootArrow(): void {
    if (!this.canShoot()) return;

    this.consumeArrow();
    const result = this.processArrowFlight();

    // Orchestration of GameRulesService calls (handleWumpusHit/handleMissedArrow)
    // is expected to be done by the consuming facade or service.
  }

  private canShoot(): boolean {
    const { alive, arrows } = this._hunter();
    if (!alive) return false;

    if (!arrows) {
      this.store.setMessage(this.transloco.translate('gameMessages.noArrows'));
      return false;
    }
    return true;
  }

  private consumeArrow(): void {
    const { arrows } = this._hunter();
    this.store.updateHunter({ arrows: arrows - 1 });
    this.sound.playSound(GameSound.SHOOT, false);
  }

  private processArrowFlight(): { hitWumpus: boolean; cell: Cell } {
    const { direction } = this._hunter();
    let { x, y } = this._hunter();
    const board = this.store.board();
    const size = this._settings().size;

    let lastCell: Cell = board[x][y];

    let currentX = x;
    let currentY = y;

    while (gridUtils.isInBounds(currentX, currentY, size)) {
      const cell = board[currentX][currentY];
      lastCell = cell; 

      if (cell.content && cell.content.type.startsWith('wumpus')) {
        return { hitWumpus: true, cell };
      }
      
      const nextPos = gridUtils.getNextPosition(currentX, currentY, direction);
      currentX = nextPos.x;
      currentY = nextPos.y;
    }
    
    return { hitWumpus: false, cell: lastCell };
  }
}
