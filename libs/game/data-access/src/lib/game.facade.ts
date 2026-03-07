import { inject, Injectable } from '@angular/core';
import { GameStore } from './store/game-store';
import { Hunter, GameState } from '@hunt-the-bishomalo/models';

@Injectable({ providedIn: 'root' })
export class GameFacade {
  private readonly store = inject(GameStore);

  // Expose signals
  readonly hunter = this.store.hunter;
  readonly board = this.store.board;
  readonly lives = this.store.lives;
  readonly unlockedChars = this.store.unlockedChars;
  readonly currentCell = this.store.currentCell;
  readonly gameStatus = this.store.gameStatus;
  readonly message = this.store.message;

  // Expose methods
  updateHunter(partial: Partial<Hunter>) {
    this.store.updateHunter(partial);
  }

  updateGame(partial: Partial<GameState>) {
    this.store.updateGame(partial);
  }

  resetStore() {
    this.store.resetStore();
  }

  countWumpusKilled() {
    this.store.countWumpusKilled();
  }

  setMessage(message: string) {
    this.store.setMessage(message);
  }
}
