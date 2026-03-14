import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { TranslocoService } from '@jsverse/transloco';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { GameSound, GameSettings } from '@hunt-the-bishomalo/data';

export interface BossCell {
  x: number;
  y: number;
  hit: boolean;
  hasBossPart: boolean;
  hint?: string;
}

export interface BossState {
  gridSize: number;
  grid: BossCell[][];
  bossParts: number;
  bossRemaining: number;
  playerLives: number;
  message: string;
  gameOver: boolean;
}

const DEFAULT_GRID_SIZE = 5;
const DEFAULT_BOSS_PARTS = 5;

const initialState: BossState = {
  gridSize: DEFAULT_GRID_SIZE,
  grid: [],
  bossParts: DEFAULT_BOSS_PARTS,
  bossRemaining: DEFAULT_BOSS_PARTS,
  playerLives: 3,
  message: '',
  gameOver: false,
};

export const BossStore = signalStore(
  withState(initialState),
  withMethods(
    (store, gameSound = inject(GameSoundService), translocoService = inject(TranslocoService)) => {
      const getHint = (grid: BossCell[][], x: number, y: number): string => {
        const row = grid[x];
        const col = grid.map((r) => r[y]);

        const inRow = row.filter((c) => c.hasBossPart && !c.hit).length;
        const inCol = col.filter((c) => c.hasBossPart && !c.hit).length;

        if (inRow >= inCol) {
          return translocoService.translate('bossFightMessages.hintInRow', { count: inRow });
        }

        return translocoService.translate('bossFightMessages.hintInCol', { count: inCol });
      };

      const revealAllBossParts = (grid: BossCell[][]): BossCell[][] => {
        return grid.map((row) =>
          row.map((cell) => (cell.hasBossPart ? { ...cell, hit: true } : cell)),
        );
      };

      return {
        resetGame(settings: GameSettings) {
          gameSound.stop();
          gameSound.playSound(GameSound.BATTLE, false);

          const gridSize = DEFAULT_GRID_SIZE;
          const bossParts = DEFAULT_BOSS_PARTS;
          const grid = Array.from({ length: gridSize }, (_, x) =>
            Array.from({ length: gridSize }, (_, y) => ({
              x,
              y,
              hit: false,
              hasBossPart: false,
              hint: '',
            })),
          );

          let partsPlaced = 0;
          while (partsPlaced < bossParts) {
            /**
             * Security Hotspot Justification:
             * Math.random() is used here for game mechanics (randomizing boss part positions).
             * It does not involve any security-sensitive operations.
             */
            const x = Math.floor(Math.random() * gridSize);
            const y = Math.floor(Math.random() * gridSize);
            if (!grid[x][y].hasBossPart) {
              grid[x][y].hasBossPart = true;
              partsPlaced++;
            }
          }

          patchState(store, {
            grid,
            gridSize,
            bossParts,
            bossRemaining: bossParts,
            playerLives: settings.difficulty.bossTries,
            message: translocoService.translate('bossFightMessages.initial'),
            gameOver: false,
          });
        },

        attackCell(cell: BossCell) {
          if (store.gameOver() || cell.hit) return;

          const { bossRemaining, playerLives, message, gameOver, grid } = store;
          let newBossRemaining = bossRemaining();
          let newPlayerLives = playerLives();
          let newGameOver = gameOver();
          let newMessage = message();

          const updatedGrid = grid().map((row) =>
            row.map((c) => {
              if (c.x === cell.x && c.y === cell.y) {
                const hit = true;
                if (c.hasBossPart) {
                  newBossRemaining--;
                  newMessage = translocoService.translate('bossFightMessages.bossHit');
                } else {
                  newPlayerLives--;
                  const hint = getHint(grid(), c.x, c.y);
                  newMessage = translocoService.translate('bossFightMessages.miss', { hint });
                  return { ...c, hit, hint };
                }
                return { ...c, hit };
              }
              return c;
            }),
          );

          if (newBossRemaining === 0) {
            newMessage = translocoService.translate('bossFightMessages.bossDefeated');
            newGameOver = true;
            gameSound.stop();
            gameSound.playSound(GameSound.FINISH, false);
          } else if (newPlayerLives === 0) {
            newMessage = translocoService.translate('bossFightMessages.playerDefeated');
            const revealedGrid = revealAllBossParts(updatedGrid);
            patchState(store, {
              grid: revealedGrid,
              playerLives: 0,
              message: newMessage,
              gameOver: true,
            });
            gameSound.stop();
            gameSound.playSound(GameSound.PITDIE, false);
            return;
          }

          patchState(store, {
            grid: updatedGrid,
            bossRemaining: newBossRemaining,
            playerLives: newPlayerLives,
            message: newMessage,
            gameOver: newGameOver,
          });
        },

        setMessage(message: string) {
          patchState(store, { message });
        },
      };
    },
  ),
);
