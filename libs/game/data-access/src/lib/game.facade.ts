import { inject, Injectable } from '@angular/core';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { IGameFacade, GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { GameState } from '@hunt-the-bishomalo/shared-data';

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
  readonly x = this.store.x;
  readonly y = this.store.y;
  readonly direction = this.store.direction;
  readonly arrows = this.store.arrows;
  readonly currentCell = this.store.currentCell;
  readonly inventory = this.store.inventory;
  readonly wumpusKilled = this.store.wumpusKilled;
  readonly soundEnabled = this.store.soundEnabled;
  readonly gold = this.store.gold;
  readonly hunter = this.store.hunter;
  readonly blackout = this.store.blackout;
  readonly hasLantern = this.store.hasLantern;
  readonly hasShield = this.store.hasShield;

  readonly hasGold = this.store.hasGold;

  moveForward(): void {
    this.engine.moveForward();
  }

  turnLeft(): void {
    this.engine.turnLeft();
  }

  turnRight(): void {
    this.engine.turnRight();
  }

  performAction(): void {
    this.engine.performAction();
  }

  shootArrow(): void {
    this.performAction();
  }

  newGame(): void {
    this.engine.newGame();
  }

  initGame(): void {
    this.engine.initGame();
  }

  toggleSound(): void {
    this.store.toggleSound();
  }

  updateGame(partial: Partial<GameState>): void {
    this.store.updateGame(partial);
  }
}
