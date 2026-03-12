import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BossFightComponent } from './boss-fight.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GameSoundService } from '@hunt-the-bishomalo/core';
import { GameSettings, RouteTypes } from '@hunt-the-bishomalo/data';
import { GameStore } from '@hunt-the-bishomalo/game/api';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core';
import { BossCell } from './boss-store';

describe('BossFightComponent', () => {
  let component: BossFightComponent;
  let fixture: ComponentFixture<BossFightComponent>;

  const mockHunter = signal({ lives: 3 });

  const gameStoreMock = {
    hunter: mockHunter,
    updateHunter: jest.fn(),
    lives: () => 8,
    updateGame: jest.fn(),
    settings: jest.fn().mockReturnValue({
      difficulty: {
        bossTries: 12,
      },
    }),
  };

  const gameSoundMock = {
    playSound: jest.fn(),
    stop: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BossFightComponent,
        CommonModule,
        RouterModule.forRoot([]),
        getTranslocoTestingModule(),
      ],
      providers: [
        { provide: GameStore, useValue: gameStoreMock },
        { provide: GameSoundService, useValue: gameSoundMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BossFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the game grid on ngOnInit', () => {
    expect(component.bossStore.grid().length).toBe(component.bossStore.gridSize());
    expect(component.bossStore.grid()[0].length).toBe(component.bossStore.gridSize());
    expect(component.bossStore.bossRemaining()).toBe(component.bossStore.bossParts());
    expect(component.bossStore.playerLives()).toBe(12);
    expect(component.bossStore.gameOver()).toBe(false);
  });

  it('should reduce bossRemaining on boss hit', () => {
    const bossCell = component.bossStore.grid()[1][1];
    (bossCell as BossCell).hasBossPart = true;

    component.bossStore.attackCell(bossCell);

    expect(component.bossStore.bossRemaining()).toBe(component.bossStore.bossParts() - 1);
    expect(component.bossStore.message()).toContain('bossFightMessages.bossHit');
  });

  it('should end game and reveal parts when lives reach 0', () => {
    const settings = {
      difficulty: {
        bossTries: 1,
      },
    } as GameSettings;
    component.bossStore.resetGame(settings);

    const cell = component.bossStore
      .grid()
      .flat()
      .find((c) => !c.hasBossPart);
    if (cell) {
      component.bossStore.attackCell(cell);
    }

    expect(component.bossStore.gameOver()).toBe(true);
    expect(component.bossStore.message()).toContain('bossFightMessages.playerDefeated');
    expect(
      component.bossStore
        .grid()
        .flat()
        .filter((c) => c.hasBossPart && c.hit).length,
    ).toBeGreaterThan(0);
  });

  it('should retry game if hunter has lives', () => {
    component.retryGame();

    expect(gameStoreMock.updateGame).toHaveBeenCalledWith({ lives: 7 });
    expect(component.bossStore.gameOver()).toBe(false);
    expect(component.bossStore.playerLives()).toBe(12);
  });

  it('should not retry game if hunter has no lives', () => {
    gameStoreMock.lives = () => 0;

    component.retryGame();

    expect(gameStoreMock.updateHunter).not.toHaveBeenCalled();
    expect(component.bossStore.message()).toContain('bossFightMessages.noMoreRetries');
  });

  it('should navigate to prize screen on goToprizeScreen', () => {
    component.goToprizeScreen();

    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.RESULTS], {
      state: { fromSecretPath: true },
      queryParams: { boss: true },
    });
  });

  it('should return position and "not selected" status if cell not hit', () => {
    const cell = {
      x: 0,
      y: 0,
      hit: false,
      hasBossPart: false,
    };

    const label = component.getAriaLabel(cell, 0, 1);
    expect(label).toContain('bossFightMessages.ariaCellPosition');
  });

  it('should return position and "boss hit" status if cell is hit and has boss part', () => {
    const cell = {
      x: 1,
      y: 1,
      hit: true,
      hasBossPart: true,
    };

    const label = component.getAriaLabel(cell, 1, 2);
    expect(label).toContain('bossFightMessages.ariaCellStatusBossHit');
  });

  it('should return position and "miss" status with hint if cell is hit but has no boss part', () => {
    const cell = {
      x: 2,
      y: 2,
      hit: true,
      hasBossPart: false,
      hint: 'nearby',
    };

    const label = component.getAriaLabel(cell, 2, 3);
    expect(label).toContain('bossFightMessages.ariaCellStatusMiss');
  });
});
