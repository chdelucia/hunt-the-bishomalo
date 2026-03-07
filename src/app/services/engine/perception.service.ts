import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { GameStore } from '../../store/game-store';
import { GameSoundService } from '../sound/game-sound.service';
import { Cell, CELL_CONTENTS, GameSound } from '../../models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerceptionService {
  private readonly store = inject(GameStore);
  private readonly transloco = inject(TranslocoService);
  private readonly sound = inject(GameSoundService);

  public getPerceptionMessage(): Observable<string> {
    const adjacentCells = this.getAdjacentCells();
    const perceptions: string[] = [];

    for (const cell of adjacentCells) {
      const perception = this.getPerceptionFromCell(cell);
      if (perception) perceptions.push(perception);
    }

    if (perceptions.length > 0) {
      return of(perceptions.join(' '));
    } else {
      return this.transloco.selectTranslate('gameMessages.perceptionNothingSuspicious');
    }
  }

  private getAdjacentCells(): Cell[] {
    const { x, y } = this.store.hunter();
    const size = this.store.settings().size;
    const board = this.store.board();

    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    return directions
      .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
      .filter(({ x, y }) => x >= 0 && y >= 0 && x < size && y < size)
      .map(({ x, y }) => board[x][y]);
  }

  private getPerceptionFromCell(cell: Cell): string | null {
    if (cell.content?.type === 'wumpus') {
      this.sound.playSound(GameSound.WUMPUS);
      return this.transloco.translate('gameMessages.perceptionStench');
    }

    if (cell.content === CELL_CONTENTS.pit) {
      this.sound.playSound(GameSound.WIND);
      return this.transloco.translate('gameMessages.perceptionBreeze');
    }

    if (cell.content === CELL_CONTENTS.gold) {
      this.sound.playSound(GameSound.GOLD);
      return this.transloco.translate('gameMessages.perceptionShine');
    }

    return null;
  }
}
