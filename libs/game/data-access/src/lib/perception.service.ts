import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Cell, CELL_CONTENTS, GameSound } from '@hunt-the-bishomalo/shared-data';
import { GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerceptionService {
  private readonly transloco = inject(TranslocoService);
  private readonly sound = inject(GAME_SOUND_TOKEN);

  getPerceptionMessage(adjacentCells: Cell[]): Observable<string> {
    const uniqueHazards = new Set<string>();

    for (const cell of adjacentCells) {
      const hazard = this.identifyHazard(cell);
      if (hazard) uniqueHazards.add(hazard);
    }

    if (uniqueHazards.size > 0) {
      const messages = Array.from(uniqueHazards).map((hazard) => this.processHazard(hazard));
      return of(messages.join(' '));
    }

    return this.transloco.selectTranslate('gameMessages.perceptionNothingSuspicious');
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
