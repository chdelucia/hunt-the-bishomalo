import { computed, inject, Injectable } from '@angular/core';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { IGameFacade, GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';

@Injectable({ providedIn: 'root' })
export class GameFacade implements IGameFacade {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly engine = inject(GAME_ENGINE_TOKEN);

  readonly board = this.store.board;
  readonly isAlive = this.store.isAlive;
  readonly deathByWumpus = this.store.deathByWumpus;
  readonly hasWon = this.store.hasWon;
  readonly settings = this.store.settings;
  readonly message = this.store.message;
  readonly lives = this.store.lives;
  readonly currentCell = this.store.currentCell;
  readonly inventory = this.store.inventory;
  readonly wumpusKilled = this.store.wumpusKilled;
  readonly soundEnabled = this.store.soundEnabled;
  readonly dragonballs = this.store.dragonballs;
  readonly gold = this.store.gold;
  readonly hunter = this.store.hunter;
  readonly blackout = this.store.blackout;

  moveForward(): void {
    this.engine.moveForward();
  }

  turnLeft(): void {
    this.engine.turnLeft();
  }

  turnRight(): void {
    this.engine.turnRight();
  }

  shootArrow(): void {
    this.engine.shootArrow();
  }

  newGame(): void {
    this.engine.newGame();
  }

  toggleSound(): void {
    this.store.toggleSound();
  }
}
