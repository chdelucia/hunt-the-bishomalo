import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { GameStore } from '../../store/game-store';
import { GameSoundService } from '../sound/game-sound.service';
import { AchievementService } from '../achievement/achievement.service';
import { GameEventService } from '../event/game-event.service';
import { Cell, CELL_CONTENTS, GameSound, AchieveTypes, Hunter, CellContentType } from '../../models';
import * as gameRulesUtils from '../../utils/game-rules.utils';
import * as gridUtils from '../../utils/grid.utils';

@Injectable({ providedIn: 'root' })
export class GameRulesService {
  store = inject(GameStore);
  sound = inject(GameSoundService);
  achieve = inject(AchievementService);
  gameEvents = inject(GameEventService);
  transloco = inject(TranslocoService);

  private readonly _settings = this.store.settings;
  private readonly _hunter = this.store.hunter;

  constructor() {}

  public checkCurrentCell(previousX: number, previousY: number): void {
    const cell = this.store.currentCell();
    cell.visited = true;

    const contentType = cell.content?.type;

    if (contentType === 'pit' || (contentType && contentType.startsWith('wumpus'))) {
      const survived = this.playerHasRevive(
        contentType === 'pit' ? 'pit' : 'wumpus', 
        cell, 
        { x: previousX, y: previousY }
      );
      if (survived) return;
    }

    if (cell.content) {
      this.gameEvents.applyEffectByCellContent(this._hunter(), cell);
      return; 
    }

    this.sound.playSound(GameSound.WALK, false);
    this.store.setMessage(this.getPerceptionMessage());
  }

  private playerHasRevive(
    cause: 'pit' | 'wumpus',
    cell: Cell,
    prevPos: { x: number; y: number },
  ): boolean {
    const { hunter } = this.gameEvents.applyEffectsOnDeath(this._hunter(), cause, cell, prevPos);
    return hunter.alive;
  }

  public getPerceptionMessage(): string {
    const adjacentCells = this.getAdjacentCells();
    const perceptions: string[] = [];

    for (const cell of adjacentCells) {
      const perception = this.getPerceptionFromCell(cell);
      if (perception) perceptions.push(perception);
    }

    return perceptions.length > 0
      ? perceptions.join(' ')
      : this.transloco.translate('gameMessages.perceptionNothingSuspicious');
  }

  private getAdjacentCells(): Cell[] {
    const { x, y } = this._hunter();
    const size = this._settings().size;
    const board = this.store.board();

    const directions = [
      { dx: 0, dy: -1 }, 
      { dx: 0, dy: 1 },  
      { dx: -1, dy: 0 }, 
      { dx: 1, dy: 0 },  
    ];
    
    const cells: Cell[] = [];
    for(const dir of directions) {
        const adjX = x + dir.dx;
        const adjY = y + dir.dy;
        if(gridUtils.isInBounds(adjX, adjY, size)) {
            cells.push(board[adjX][adjY]);
        }
    }
    return cells;
  }

  private getPerceptionFromCell(cell: Cell): string | null {
    if (cell.content?.type.startsWith('wumpus')) {
      this.sound.playSound(GameSound.WUMPUS);
      return this.transloco.translate('gameMessages.perceptionStench');
    }

    if (cell.content?.type === 'pit') {
      this.sound.playSound(GameSound.WIND);
      return this.transloco.translate('gameMessages.perceptionBreeze');
    }

    if (cell.content?.type === 'gold') {
      this.sound.playSound(GameSound.GOLD);
      return this.transloco.translate('gameMessages.perceptionShine');
    }
    return null;
  }

  public handleWumpusHit(cell: Cell): void {
    cell.content = undefined; 
    this.store.setMessage(this.transloco.translate('gameMessages.wumpusKilled'));
    this.sound.stopWumpus(); 
    this.sound.playSound(GameSound.PAIN, false); 
    
    const currentHunter = this._hunter();
    this.store.updateHunter({ wumpusKilled: currentHunter.wumpusKilled + 1 });
    this.achieve.handleWumpusKillAchieve(cell); 

    const droppedItemType = gameRulesUtils.determineRandomItemDrop(this._settings().difficulty.luck);
    if (droppedItemType) {
      cell.content = CELL_CONTENTS[droppedItemType];
    }
  }

  public handleMissedArrow(): void {
    this.store.setMessage(this.transloco.translate('gameMessages.arrowMissed'));
    if (!this._hunter().arrows) {
      this.achieve.activeAchievement(AchieveTypes.MISSEDSHOT);
    }
  }
}
