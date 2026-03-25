import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { RouteTypes, ScoreEntry } from '@hunt-the-bishomalo/shared-data';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/api';
import { signal } from '@angular/core';

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
    { id: '1', title: 'Logro 1', unlocked: true, rarity: 'common', description: '', svgIcon: '' },
  ],
  completed: signal(undefined),
};

const mockLeaderboardService = {
  leaderboard: mockLeaderboard,
};

const routerMock = {
  navigate: jest.fn(),
  navigateByUrl: jest.fn(),
};

const activateRouteMock = {
  snapshot: {
    queryParams: {
      boss: true,
    },
  },
};

const mockGameStore = {
  unlockedChars: signal([]),
};

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent, getTranslocoTestingModule()],
      providers: [
        { provide: ACHIEVEMENT_SERVICE, useValue: mockAchievementService },
        { provide: LEADERBOARD_SERVICE, useValue: mockLeaderboardService },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activateRouteMock },
        { provide: GAME_STORE_TOKEN, useValue: mockGameStore },
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
    expect(component.unlockedAchievements).toBe(1);
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

  it('should go to CHARS when boss param and not all chars unlocked', () => {
    component.goToCredits();
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.CHARS], {
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
    expect(stats.tiempo.hours).toBe(0);
    expect(stats.tiempo.minutes).toBe(3);
    expect(stats.tiempo.seconds).toBe(0);
  });
});
