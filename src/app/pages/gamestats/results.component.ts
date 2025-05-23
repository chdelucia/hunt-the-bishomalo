import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService, GameStoreService, LeaderboardService } from 'src/app/services';
import { RouteTypes, ScoreEntry } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  tabActiva = signal<'general' | 'niveles'>('general');
  leaderboard: ScoreEntry[] = [];
  unlockedAchievements = 0;
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly achieve: AchievementService,
    private readonly router: Router,
    private readonly routeSnapshot: ActivatedRoute,
    private readonly gameStore: GameStoreService
  ) {
    this.unlockedAchievements = achieve.achievements.filter((item) => item.unlocked).length;
    this.leaderboard = leaderboardService._leaderboard;
  }

  estadisticasGenerales = computed(() => {
    const totalSteps = this.leaderboard.reduce((sum, e) => sum + e.steps, 0);
    const totalDeaths = this.leaderboard.reduce((sum, e) => sum + e.deads, 0);
    const totalArrows = this.leaderboard.reduce((sum, e) => sum + e.wumpusKilled, 0);
    const totalItems = this.leaderboard.reduce((sum, e) => sum + (e.blackout ? 1 : 0), 0);
    const totalCoins = 875; // Placeholder
    const completedLevels = this.leaderboard.length;
    const totalSeconds = this.leaderboard.reduce((sum, e) => sum + e.timeInSeconds, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      pasosTotales: totalSteps,
      muertes: totalDeaths,
      flechasDisparadas: totalArrows,
      objetosUsados: totalItems,
      monedasRecolectadas: totalCoins,
      nivelesCompletados: completedLevels,
      tiempoJuego: `${hours}h ${minutes}m ${seconds}s`,
      oroTotal: totalCoins,
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

    if(this.gameStore.hunter().chars?.length === 4 || !boss){
      this.router.navigateByUrl(RouteTypes.CREDITS);
      return;
    }
    
    this.router.navigate([RouteTypes.CHARS],{
       state: {
        fromSecretPath: true,
      }
    });
  }
}
