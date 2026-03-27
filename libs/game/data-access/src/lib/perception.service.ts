import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Cell, CELL_CONTENTS, GameSound } from '@hunt-the-bishomalo/shared-data';
import { GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerceptionService {
  private readonly transloco = inject(TranslocoService);
  private readonly sound = inject(GAME_SOUND_TOKEN);

  /**
   * Generates a perception message based on adjacent cells and triggers unique sounds.
   * Optimization: Uses Sets to ensure each unique perception and sound is only
   * processed once, even if multiple identical hazards are adjacent.
   */
  getPerceptionMessage(adjacentCells: Cell[]): Observable<string> {
    const perceptions = new Set<string>();
    const sounds = new Set<GameSound>();

    for (const cell of adjacentCells) {
      this.analyzeCellPerception(cell, perceptions, sounds);
    }

    // Trigger unique sounds only once per perception check
    sounds.forEach((s) => this.sound.playSound(s));

    if (perceptions.size > 0) {
      return of(Array.from(perceptions).join(' '));
    } else {
      return this.transloco.selectTranslate('gameMessages.perceptionNothingSuspicious');
    }
  }

  private analyzeCellPerception(cell: Cell, perceptions: Set<string>, sounds: Set<GameSound>): void {
    if (cell.content?.type === 'wumpus') {
      sounds.add(GameSound.WUMPUS);
      perceptions.add(this.transloco.translate('gameMessages.perceptionStench'));
    }
    if (cell.content === CELL_CONTENTS.pit) {
      sounds.add(GameSound.WIND);
      perceptions.add(this.transloco.translate('gameMessages.perceptionBreeze'));
    }
    if (cell.content === CELL_CONTENTS.gold) {
      sounds.add(GameSound.GOLD);
      perceptions.add(this.transloco.translate('gameMessages.perceptionShine'));
    }
  }
}
