import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LeaderboardService } from 'src/app/services/score/leaderboard.service';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreboardComponent {
  private readonly leaderboardService = inject(LeaderboardService)
  readonly leaderboard = this.leaderboardService.leaderboard;
  
  isLeaderboardVisible = false;

  toggleLeaderboard(): void {
    this.isLeaderboardVisible = !this.isLeaderboardVisible;
  }
}
