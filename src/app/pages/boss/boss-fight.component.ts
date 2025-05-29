import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { GameSoundService } from 'src/app/services';
import { GameSound, RouteTypes } from 'src/app/models';
import { Router } from '@angular/router';
import { GameStore } from 'src/app/store';

interface BossCell {
  x: number;
  y: number;
  hit: boolean;
  hasBossPart: boolean;
  hint?: string;
}

@Component({
  selector: 'app-boss-fight',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './boss-fight.component.html',
  styleUrl: './boss-fight.component.scss',
})
export class BossFightComponent implements OnInit {
  private readonly gameSound = inject(GameSoundService);
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  readonly _hunter = this.gameStore.hunter;
  readonly _settings = this.gameStore.settings;

  gridSize = 5;
  grid: BossCell[][] = [];
  bossParts = 5;
  bossRemaining = this.bossParts;
  playerLives = this._settings().difficulty.bossTries;
  message = '';
  gameOver = false;
  image = '';

  ngOnInit(): void {
    this.resetGame();
  }

  resetGame(): void {
    this.gameSound.stop();
    this.gameSound.playSound(GameSound.BATTLE, false);
    this.grid = Array.from({ length: this.gridSize }, (_, x) =>
      Array.from({ length: this.gridSize }, (_, y) => ({
        x,
        y,
        hit: false,
        hasBossPart: false,
        hint: '',
      })),
    );

    this.bossRemaining = this.bossParts;
    this.playerLives = this._settings().difficulty.bossTries;
    this.message = this.translocoService.translate('bossFightMessages.initial');
    this.gameOver = false;

    let partsPlaced = 0;
    while (partsPlaced < this.bossParts) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);
      if (!this.grid[x][y].hasBossPart) {
        this.grid[x][y].hasBossPart = true;
        partsPlaced++;
      }
    }
  }

  attackCell(cell: BossCell): void {
    if (this.gameOver || cell.hit) return;

    cell.hit = true;

    if (cell.hasBossPart) {
      this.bossRemaining--;
      this.message = this.translocoService.translate('bossFightMessages.bossHit');
    } else {
      this.playerLives--;
      const hint = this.getHint(cell.x, cell.y);
      cell.hint = hint;
      this.message = this.translocoService.translate('bossFightMessages.miss', { hint });
    }

    if (this.bossRemaining === 0) {
      this.message = this.translocoService.translate('bossFightMessages.bossDefeated');
      this.gameOver = true;
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FINISH, false);
    } else if (this.playerLives === 0) {
      this.message = this.translocoService.translate('bossFightMessages.playerDefeated');
      this.revealAllBossParts();
      this.gameOver = true;
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.PITDIE, false);
    }
  }

  retryGame(): void {
    if (this._hunter().lives > 0) {
      const livesLeft = this._hunter().lives;
      this.gameStore.updateHunter({ lives: Math.max(0, livesLeft - 1) });
      this.resetGame();
    } else {
      this.message = this.translocoService.translate('bossFightMessages.noMoreRetries');
    }
  }

  revealAllBossParts(): void {
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.hasBossPart) cell.hit = true;
      }
    }
  }

  getHint(x: number, y: number): string {
    const row = this.grid[x];
    const col = this.grid.map((r) => r[y]);

    const inRow = row.filter((c) => c.hasBossPart && !c.hit).length;
    const inCol = col.filter((c) => c.hasBossPart && !c.hit).length;

    if (inRow >= inCol) {
      return this.translocoService.translate('bossFightMessages.hintInRow', { count: inRow });
    }

    return this.translocoService.translate('bossFightMessages.hintInCol', { count: inCol });
  }

  getAriaLabel(cell: BossCell, x: number, y: number): string {
    const position = this.translocoService.translate('bossFightMessages.ariaCellPosition', {
      row: x + 1,
      col: y + 1,
    });
    if (!cell.hit) {
      return `${position}, ${this.translocoService.translate(
        'bossFightMessages.ariaCellStatusNotSelected',
      )}`;
    }
    if (cell.hasBossPart) {
      return `${position}, ${this.translocoService.translate(
        'bossFightMessages.ariaCellStatusBossHit',
      )}`;
    }
    return `${position}, ${this.translocoService.translate(
      'bossFightMessages.ariaCellStatusMiss',
    )} ${cell.hint}`;
  }

  goToprizeScreen(): void {
    this.router.navigate([RouteTypes.RESULTS], {
      state: {
        fromSecretPath: true,
      },
      queryParams: { boss: true },
    });
  }
}
