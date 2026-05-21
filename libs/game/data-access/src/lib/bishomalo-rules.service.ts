import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_EVENT_SERVICE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_STORE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import {
  IGameRules,
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import {
  Cell,
  CELL_CONTENTS,
  Direction,
  GameSound,
  AchieveTypes,
  Hunter,
  GameState,
  GameSettings,
} from '@hunt-the-bishomalo/shared-data';
import { BoardGeneratorService } from './board-generator.service';

@Injectable({ providedIn: 'root' })
export class BishomaloRulesService implements IGameRules {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly sound = inject(GAME_SOUND_TOKEN);
  private readonly achievementTracker = inject(GAME_ACHIEVEMENT_TRACKER_TOKEN);
  private readonly gameEvents = inject(GAME_EVENT_SERVICE_TOKEN);
  private readonly transloco = inject(TranslocoService);
  private readonly boardGenerator = inject(BoardGeneratorService);

  getInitialHunterState(): Partial<Hunter> {
    return {
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: 1,
      hasGold: false,
    };
  }

  getInitialGameState(): Partial<GameState> {
    return {
      wumpusKilled: 0,
      isAlive: true,
      deathByWumpus: false,
      hasWon: false,
    };
  }

  getNextLevelSettings(currentSettings: GameSettings): GameSettings {
    const { size, difficulty } = currentSettings;
    const newSize = size + 1;
    return {
      ...currentSettings,
      size: newSize,
      pits: this.boardGenerator.calculatePits(size, difficulty.luck),
      wumpus: this.boardGenerator.calculateWumpus(size, difficulty.luck),
      blackout: Math.random() < 0.08,
    };
  }

  executeAction(): void {
    if (!this.canShoot()) return;
    this.consumeArrow();
    const result = this.processArrowFlight();
    if (result.hitWumpus) {
      this.handleWumpusHit(result.cell);
    } else {
      this.handleMissedArrow();
    }
  }

  onCellEntry(cell: Cell, prev: { x: number; y: number }): void {
    const contentType = cell.content?.type;

    if (contentType === 'pit' || contentType === 'wumpus') {
      const survived = this.gameEvents.applyEffectsOnDeath(contentType, cell, prev);
      if (survived) return;
    }

    if (cell.content) {
      this.gameEvents.applyEffectByCellContent(cell);
      return;
    }

    this.sound.playSound(GameSound.WALK, false);
  }

  canExitWithVictory(cell: Cell, hunter: Hunter): boolean {
    return !cell.x && !cell.y && hunter.hasGold;
  }

  getPerception(adjacentCells: Cell[]): string {
    const uniqueHazards = new Set<string>();

    for (const cell of adjacentCells) {
      const hazard = this.identifyHazard(cell);
      if (hazard) uniqueHazards.add(hazard);
    }

    if (uniqueHazards.size > 0) {
      const messages = Array.from(uniqueHazards).map((hazard) => this.processHazard(hazard));
      return messages.join(' ');
    }

    return this.transloco.translate('gameMessages.perceptionNothingSuspicious');
  }

  private canShoot(): boolean {
    const { arrows } = this.store.hunter();
    if (!this.store.isAlive()) return false;
    if (!arrows) {
      this.store.setMessage(this.transloco.translate('gameMessages.noArrows'));
      return false;
    }
    return true;
  }

  private consumeArrow(): void {
    const { arrows } = this.store.hunter();
    this.store.updateHunter({ arrows: arrows - 1 });
    this.sound.playSound(GameSound.SHOOT, false);
  }

  private processArrowFlight(): { hitWumpus: boolean; cell: Cell } {
    const { direction } = this.store.hunter();
    let { x, y } = this.store.hunter();
    const board = this.store.board();
    const size = this.store.settings().size;
    let lastCell: Cell = board[x][y];

    while (this.isInBounds(x, y, size)) {
      const cell = board[x][y];
      lastCell = cell;
      if (cell.content?.type === 'wumpus') {
        return { hitWumpus: true, cell };
      }
      ({ x, y } = this.nextPosition(x, y, direction));
    }
    return { hitWumpus: false, cell: lastCell };
  }

  private isInBounds(x: number, y: number, size: number): boolean {
    return x >= 0 && y >= 0 && x < size && y < size;
  }

  private nextPosition(x: number, y: number, dir: Direction): { x: number; y: number } {
    switch (dir) {
      case Direction.UP:
        return { x: x - 1, y };
      case Direction.DOWN:
        return { x: x + 1, y };
      case Direction.LEFT:
        return { x, y: y - 1 };
      case Direction.RIGHT:
        return { x, y: y + 1 };
    }
  }

  private handleWumpusHit(cell: Cell): void {
    cell.content = undefined;
    this.store.setMessage(this.transloco.translate('gameMessages.wumpusKilled'));
    this.sound.stopWumpus();
    this.sound.playSound(GameSound.PAIN, false);
    this.store.countWumpusKilled();
    this.achievementTracker.handleWumpusKillAchieve(cell);
    this.getDrop(cell);
  }

  private getDrop(cell: Cell): void {
    const { luck } = this.store.settings().difficulty;
    const roll = Math.random() * 100;
    if (roll < 2) cell.content = CELL_CONTENTS.extrawumpus;
    else if (roll < 20 + luck) cell.content = CELL_CONTENTS.extraheart;
    else if (roll < 35 + luck) cell.content = CELL_CONTENTS.extragold;
    else if (roll < 40 + luck) cell.content = CELL_CONTENTS.extraarrow;
  }

  private handleMissedArrow(): void {
    this.store.setMessage(this.transloco.translate('gameMessages.arrowMissed'));
    if (!this.store.hunter().arrows) {
      this.achievementTracker.activeAchievement(AchieveTypes.MISSEDSHOT);
    }
  }

  private identifyHazard(cell: Cell): string | null {
    if (cell.content?.type === 'wumpus') return 'wumpus';
    if (cell.content === CELL_CONTENTS.pit) return 'pit';
    if (cell.content === CELL_CONTENTS.gold) return 'gold';
    return null;
  }

  private processHazard(hazard: string): string {
    switch (hazard) {
      case 'wumpus':
        this.sound.playSound(GameSound.WUMPUS);
        return this.transloco.translate('gameMessages.perceptionStench');
      case 'pit':
        this.sound.playSound(GameSound.WIND);
        return this.transloco.translate('gameMessages.perceptionBreeze');
      case 'gold':
        this.sound.playSound(GameSound.GOLD);
        return this.transloco.translate('gameMessages.perceptionShine');
      default:
        return '';
    }
  }
}
