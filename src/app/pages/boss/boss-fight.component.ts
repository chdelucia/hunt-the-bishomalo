import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSoundService, GameStoreService } from 'src/app/services';
import { GameSound, RouteTypes } from 'src/app/models';
import { Router } from '@angular/router';

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
  imports: [CommonModule],
  templateUrl: './boss-fight.component.html',
  styleUrl: './boss-fight.component.scss',
})
export class BossFightComponent implements OnInit {
  private readonly gameSound = inject(GameSoundService);
  readonly gameStore = inject(GameStoreService);
  private readonly router = inject(Router);
  readonly _hunter = this.gameStore.hunter;
  private readonly _settings = this.gameStore.settings;

  gridSize = 5;
  grid: BossCell[][] = [];
  bossParts = 5;
  bossRemaining = this.bossParts;
  playerLives = this._settings().difficulty.bossTries;
  message = '';
  gameOver = false;

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
    this.message =
      'Cuando estabas apunto de escapar y ya veias la luz solar, te ataco un ser maligno. Descubre las 5 localizaciones del bisho malo, tus vidas ahora son continues.';
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
      this.message = '🔥 ¡Golpeaste al jefe!';
    } else {
      this.playerLives--;
      const hint = this.getHint(cell.x, cell.y);
      cell.hint = hint;
      this.message = `❌ Fallaste. ${hint}`;
    }

    if (this.bossRemaining === 0) {
      this.message = '🎉 ¡Venciste al jefe!';
      this.gameOver = true;
    } else if (this.playerLives === 0) {
      this.message = '💀 El jefe te derrotó.';
      this.revealAllBossParts();
      this.gameOver = true;
    }
  }

  retryGame(): void {
    if (this._hunter().lives > 0) {
      const livesLeft = this._hunter().lives;
      this.gameStore.updateHunter({ lives: Math.max(0, livesLeft - 1) });
      this.resetGame();
    } else {
      this.message = '😵 No te quedan vidas para reintentar.';
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

    return `En la misma fila ${inRow} bisho(s). En la columna ${inCol} bisho(s).`;
  }

  getAriaLabel(cell: BossCell, x: number, y: number): string {
    const position = `Celda ${x + 1},${y + 1}`;
    if (!cell.hit) return `${position}, sin seleccionar`;
    if (cell.hasBossPart) return `${position}, golpe al jefe`;
    return `${position}, fallo. ${cell.hint}`;
  }

  goToprizeScreen(): void {
    this.gameSound.stop();
    this.gameSound.playSound(GameSound.FINISH, false);
    this.router.navigate([RouteTypes.RESULTS], {
      state: {
        fromSecretPath: true,
      },
      queryParams: {boss: true}
    });
  }
}
