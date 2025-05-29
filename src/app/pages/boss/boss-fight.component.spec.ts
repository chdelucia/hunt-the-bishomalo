import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BossFightComponent } from './boss-fight.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GameSoundService } from 'src/app/services';
import { RouteTypes } from 'src/app/models';
import { GameStore } from 'src/app/store';
import { getTranslocoTestingModule } from 'src/app/utils';

describe('BossFightComponent', () => {
  let component: BossFightComponent;
  let fixture: ComponentFixture<BossFightComponent>;

  const mockHunter = signal({ lives: 3 });

  const gameStoreMock = {
    hunter: mockHunter,
    updateHunter: jest.fn(),
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
    expect(component.grid.length).toBe(component.gridSize);
    expect(component.grid[0].length).toBe(component.gridSize);
    expect(component.bossRemaining).toBe(component.bossParts);
    expect(component.playerLives).toBe(12);
    expect(component.gameOver).toBe(false);
  });

  it('should reduce bossRemaining on boss hit', () => {
    const bossCell = component.grid[1][1];
    bossCell.hasBossPart = true;

    component.attackCell(bossCell);

    expect(component.bossRemaining).toBe(component.bossParts - 1);
    expect(component.message).toContain('bossFightMessages.bossHit');
  });

  it('should end game and reveal parts when lives reach 0', () => {
    component.playerLives = 1;
    const cell = component.grid[2][2];
    cell.hasBossPart = false;

    component.attackCell(cell);

    expect(component.gameOver).toBe(true);
    expect(component.message).toContain('bossFightMessages.playerDefeated');
    expect(component.grid.flat().filter((c) => c.hasBossPart && c.hit).length).toBeGreaterThan(0);
  });

  it('should retry game if hunter has lives', () => {
    component.retryGame();

    expect(gameStoreMock.updateHunter).toHaveBeenCalledWith({ lives: 2 });
    expect(component.gameOver).toBe(false);
    expect(component.playerLives).toBe(12);
  });

  it('should not retry game if hunter has no lives', () => {
    mockHunter.set({ lives: 0 });

    component.retryGame();

    expect(gameStoreMock.updateHunter).not.toHaveBeenCalled();
    expect(component.message).toContain('bossFightMessages.noMoreRetries');
  });

  it('should navigate to prize screen on goToprizeScreen', () => {
    component.goToprizeScreen();

    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.RESULTS], {
      state: { fromSecretPath: true },
      queryParams: { boss: true },
    });
  });
});
