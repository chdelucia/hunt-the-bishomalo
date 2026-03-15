import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Cell, CELL_CONTENTS, GameSound } from '@hunt-the-bishomalo/data';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerceptionService {
  private readonly transloco = inject(TranslocoService);
  private readonly sound = inject(GameSoundService);

  getPerceptionMessage(adjacentCells: Cell[]): Observable<string> {
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
