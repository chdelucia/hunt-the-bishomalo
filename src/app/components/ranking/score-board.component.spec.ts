import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreboardComponent } from './score-board.component';
import { LeaderboardService } from 'src/app/services';

  const mockLeaderboardData = [
    { playerName: 'Alice', timeInSeconds: 100 },
    { player: 'Bob', timeInSeconds: 80 }
  ];

  const mockLeaderboardService = {
    leaderboard: jest.fn().mockRejectedValue(mockLeaderboardData)
  };
describe('ScoreBoardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardComponent],
      providers: [
        { provide: LeaderboardService, useValue: mockLeaderboardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle leaderboard visibility', () => {
    expect(component.isLeaderboardVisible).toBe(false);
    component.toggleLeaderboard();
    expect(component.isLeaderboardVisible).toBe(true);
    component.toggleLeaderboard();
    expect(component.isLeaderboardVisible).toBe(false);
  });
});
