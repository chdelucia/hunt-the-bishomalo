import { InjectionToken } from '@angular/core';
import { Cell, Hunter, GameState, GameSettings } from '@hunt-the-bishomalo/shared-data';
import { Observable } from 'rxjs';

export interface IGameRules {
  executeAction(): void;
  onCellEntry(cell: Cell, prev: { x: number; y: number }): void;
  canExitWithVictory(cell: Cell, hunter: Hunter): boolean;
  getInitialHunterState(): Partial<Hunter>;
  getInitialGameState(): Partial<GameState>;
  getPerception(adjacentCells: Cell[]): Observable<string>;
  getNextLevelSettings(currentSettings: GameSettings): GameSettings;
}

export const GAME_RULES_TOKEN = new InjectionToken<IGameRules>('GAME_RULES_TOKEN');
