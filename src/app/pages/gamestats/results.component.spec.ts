import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AchievementService, LeaderboardService } from 'src/app/services';
import { RouteTypes, ScoreEntry } from 'src/app/models';
import { getTranslocoTestingModule } from 'src/app/utils';

const mockLeaderboard: ScoreEntry[] = [
  {
    playerName: 'Jugador 1',
    steps: 50,
    deads: 2,
    wumpusKilled: 3,
    blackout: true,
    timeInSeconds: 120,
    level: 1,
    date: new Date(),
  },
  {
    playerName: 'Jugador 2',
    steps: 30,
    deads: 1,
    wumpusKilled: 1,
    blackout: false,
    timeInSeconds: 60,
    level: 2,
    date: new Date(),
  },
];

const mockAchievementService = {
  achievements: [
    { name: 'Logro 1', unlocked: true },
    { name: 'Logro 2', unlocked: false },
    { name: 'Logro 3', unlocked: true },
  ],
};

const mockLeaderboardService = {
  _leaderboard: mockLeaderboard,
};

const routerMOck = {
  navigate: jest.fn(),
};

const activateRouteMock = {
  snapshot: {
    queryParams: {
      boss: true,
    },
  },
};

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent, CommonModule, getTranslocoTestingModule()],
      providers: [
        { provide: AchievementService, useValue: mockAchievementService },
        { provide: LeaderboardService, useValue: mockLeaderboardService },
        { provide: Router, useValue: routerMOck },
        { provide: ActivatedRoute, useValue: activateRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ResultsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should compute unlocked achievements correctly', () => {
    expect(component.unlockedAchievements).toBe(2);
  });

  it('should return the fastest level', () => {
    const fastest = component.nivelMasRapido();
    expect(fastest.level).toBe(2);
    expect(fastest.timeInSeconds).toBe(60);
  });

  it('should return the level with fewer steps', () => {
    const fewestSteps = component.nivelMenosPasos();
    expect(fewestSteps.level).toBe(2);
    expect(fewestSteps.steps).toBe(30);
  });

  it('should change tab correctly', () => {
    component.cambiarTab('niveles');
    expect(component.tabActiva()).toBe('niveles');
  });

  it('should go to credits on click btn', () => {
    component.goToCredits();
    expect(routerMOck.navigate).toHaveBeenCalledWith([RouteTypes.CHARS], {
      state: { fromSecretPath: true },
    });
  });

  it('should compute general statistics correctly', () => {
    const stats = component.estadisticasGenerales();
    expect(stats.pasosTotales).toBe(80);
    expect(stats.muertes).toBe(3);
    expect(stats.flechasDisparadas).toBe(4);
    expect(stats.objetosUsados).toBe(1);
    expect(stats.nivelesCompletados).toBe(2);
    expect(stats.tiempoJuego).toBe('0h 3m 0s');
  });
});
