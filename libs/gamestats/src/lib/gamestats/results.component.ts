import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../leaderboard.service';
import { RouteTypes, ScoreEntry } from '@hunt-the-bishomalo/data';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { TranslocoModule } from '@jsverse/transloco';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';

@Component({
  selector: 'lib-results',
  imports: [CommonModule, TranslocoModule],
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  tabActiva = signal<'general' | 'niveles'>('general');
  leaderboard: ScoreEntry[] = [];
  unlockedAchievements = 0;

  gameStore = inject(GameStore);
  leaderboardService = inject(LeaderboardService);
  achieve = inject(ACHIEVEMENT_SERVICE);
  router = inject(Router);
  routeSnapshot = inject(ActivatedRoute);

  constructor() {
    this.unlockedAchievements = (this.achieve as any).achievements.filter(
      (item: any) => item.unlocked,
    ).length;
    this.leaderboard = this.leaderboardService._leaderboard;
  }

  estadisticasGenerales = computed(() => {
    const totalSteps = this.leaderboard.reduce((sum, e) => sum + e.steps, 0);
    const totalDeaths = this.leaderboard.reduce((sum, e) => sum + e.deads, 0);
    const totalArrows = this.leaderboard.reduce((sum, e) => sum + e.wumpusKilled, 0);
    const totalItems = this.leaderboard.reduce((sum, e) => sum + (e.blackout ? 1 : 0), 0);
    const completedLevels = this.leaderboard[this.leaderboard.length - 1].level;
    const totalSeconds = this.leaderboard.reduce((sum, e) => sum + e.timeInSeconds, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      pasosTotales: totalSteps,
      muertes: totalDeaths,
      flechasDisparadas: totalArrows,
      objetosUsados: totalItems,
      nivelesCompletados: completedLevels,
      tiempoJuego: `${hours}h ${minutes}m ${seconds}s`,
    };
  });

  nivelMasRapido = computed(() => {
    return [...this.leaderboard].sort((a, b) => a.timeInSeconds - b.timeInSeconds)[0];
  });

  nivelMenosPasos = computed(() => {
    return [...this.leaderboard].sort((a, b) => a.steps - b.steps)[0];
  });

  cambiarTab(tab: 'general' | 'niveles') {
    this.tabActiva.set(tab);
  }

  goToCredits(): void {
    const boss = this.routeSnapshot.snapshot.queryParams['boss'];

    if (this.gameStore.unlockedChars.length === 4 || !boss) {
      this.router.navigateByUrl(RouteTypes.CREDITS);
      return;
    }

    this.router.navigate([RouteTypes.CHARS], {
      state: {
        fromSecretPath: true,
      },
    });
  }
}
