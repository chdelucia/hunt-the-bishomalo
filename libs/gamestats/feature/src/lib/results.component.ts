import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { RouteTypes, ScoreEntry } from '@hunt-the-bishomalo/shared-data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { ActivatedRoute, Router } from '@angular/router';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-results',
  imports: [TranslocoModule, DecimalPipe],
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  readonly tabActiva = signal<'general' | 'niveles'>('general');
  readonly leaderboard = signal<ScoreEntry[]>([]);
  unlockedAchievementsCount = computed(() => {
    const list = this.achieve.achievements();
    return list.filter((item) => item.unlocked).length;
  });

  private readonly gameStore = inject(GAME_STORE_TOKEN);
  private readonly leaderboardService = inject(LEADERBOARD_SERVICE);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly router = inject(Router);
  private readonly routeSnapshot = inject(ActivatedRoute);

  constructor() {
    this.leaderboard.set(this.leaderboardService.leaderboard);
  }

  // Optimized consolidated stats calculation in a single O(N) pass
  private readonly stats = computed(() => {
    const data = this.leaderboard();
    if (!data.length) return null;

    let totalSteps = 0;
    let totalDeaths = 0;
    let totalArrows = 0;
    let totalItems = 0;
    let totalSeconds = 0;
    let fastestLevel = data[0];
    let fewestStepsLevel = data[0];

    for (const entry of data) {
      totalSteps += entry.steps;
      totalDeaths += entry.deads;
      totalArrows += entry.wumpusKilled;
      totalItems += entry.blackout ? 1 : 0;
      totalSeconds += entry.timeInSeconds;

      if (entry.timeInSeconds < fastestLevel.timeInSeconds) {
        fastestLevel = entry;
      }
      if (entry.steps < fewestStepsLevel.steps) {
        fewestStepsLevel = entry;
      }
    }

    const completedLevels = data.at(-1)?.level ?? 0;

    return {
      general: {
        pasosTotales: totalSteps,
        muertes: totalDeaths,
        flechasDisparadas: totalArrows,
        objetosUsados: totalItems,
        nivelesCompletados: completedLevels,
        tiempo: {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        },
      },
      fastestLevel,
      fewestStepsLevel,
    };
  });

  readonly estadisticasGenerales = computed(
    () => this.stats()?.general ?? {
      pasosTotales: 0,
      muertes: 0,
      flechasDisparadas: 0,
      objetosUsados: 0,
      nivelesCompletados: 0,
      tiempo: { hours: 0, minutes: 0, seconds: 0 }
    },
  );

  readonly nivelMasRapido = computed(
    () => this.stats()?.fastestLevel ?? ({} as ScoreEntry),
  );

  readonly nivelMenosPasos = computed(
    () => this.stats()?.fewestStepsLevel ?? ({} as ScoreEntry),
  );

  cambiarTab(tab: 'general' | 'niveles') {
    this.tabActiva.set(tab);
  }

  goToCredits(): void {
    const boss = this.routeSnapshot.snapshot.queryParams['boss'];

    if (this.gameStore.unlockedChars().length === 4 || !boss) {
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
