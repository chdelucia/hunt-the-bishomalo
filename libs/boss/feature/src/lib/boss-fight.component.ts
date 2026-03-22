import { Component, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { Router } from '@angular/router';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { BossStore, BossCell } from './boss-store';

@Component({
  selector: 'lib-boss-fight',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './boss-fight.component.html',
  styleUrl: './boss-fight.component.scss',
  providers: [BossStore],
})
export class BossFightComponent implements OnInit {
  readonly gameStore = inject(GAME_STORE_TOKEN);
  readonly bossStore = inject(BossStore);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  readonly _settings = this.gameStore.settings;

  ngOnInit(): void {
    this.bossStore.resetGame(this._settings());
  }

  retryGame(): void {
    const livesLeft = this.gameStore.lives();
    if (!livesLeft) {
      this.bossStore.setMessage(this.translocoService.translate('bossFightMessages.noMoreRetries'));
      return;
    }

    this.gameStore.updateGame({ lives: Math.max(0, livesLeft - 1) });
    this.bossStore.resetGame(this._settings());
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
