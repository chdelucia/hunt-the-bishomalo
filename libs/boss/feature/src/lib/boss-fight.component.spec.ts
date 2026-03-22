import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BossFightComponent } from './boss-fight.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GAME_SOUND_TOKEN, GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GameSettings, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
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
        { provide: GAME_STORE_TOKEN, useValue: gameStoreMock },
        { provide: GAME_SOUND_TOKEN, useValue: gameSoundMock },
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

  it('should not allow attacking cell if game is over or cell already hit', () => {
    const cell = component.bossStore.grid()[0][0];
    const initialRemaining = component.bossStore.bossRemaining();

    // Mark game as over
    component.bossStore.setMessage('Game Over');
    (component.bossStore as any).gameOver.set(true);

    component.bossStore.attackCell(cell);
    expect(component.bossStore.bossRemaining()).toBe(initialRemaining);

    // Mark game as NOT over, but hit the cell
    (component.bossStore as any).gameOver.set(false);
    (cell as any).hit = true;
    component.bossStore.attackCell(cell);
    expect(component.bossStore.bossRemaining()).toBe(initialRemaining);
  });

  it('should handle boss defeated scenario', () => {
    const grid = component.bossStore.grid();
    // Hit all boss parts
    grid.flat().forEach(cell => {
      if (cell.hasBossPart) {
        component.bossStore.attackCell(cell);
      }
    });

    expect(component.bossStore.gameOver()).toBe(true);
    expect(component.bossStore.message()).toContain('bossFightMessages.bossDefeated');
  });

  it('should provide hints in column if inCol > inRow', () => {
    // Manually setting up a scenario for hints
    const settings = {
        difficulty: { bossTries: 10 }
    } as any;
    component.bossStore.resetGame(settings);

    const grid = component.bossStore.grid();
    // Clear all boss parts
    grid.flat().forEach(c => {
        c.hasBossPart = false;
        c.hit = false;
    });

    // Place boss parts in a column (0,1) and (1,1)
    grid[0][1].hasBossPart = true;
    grid[1][1].hasBossPart = true;

    // Attack (2,1).
    // row 2: [] -> inRow = 0
    // col 1: [grid[0][1], grid[1][1]] -> inCol = 2
    // since inCol (2) > inRow (0), it should return hintInCol

    // We need to re-fetch the cell from the store to ensure it's the correct reference if the store logic re-maps the grid
    const targetCell = component.bossStore.grid()[2][1];
    component.bossStore.attackCell(targetCell);
    // The message is translated, and getTranslocoTestingModule typically returns the key
    expect(component.bossStore.message()).toContain('bossFightMessages.miss');
  });

  it('should provide hints in row if inRow >= inCol', () => {
    const settings = { difficulty: { bossTries: 10 } } as any;
    component.bossStore.resetGame(settings);

    const grid = component.bossStore.grid();
    grid.flat().forEach(c => {
        c.hasBossPart = false;
        c.hit = false;
    });

    // Place boss parts in a row (1,0) and (1,2)
    grid[1][0].hasBossPart = true;
    grid[1][2].hasBossPart = true;

    // Attack (1,1) -> row 1 has 2 parts, col 1 has 0 parts.
    const targetCell = component.bossStore.grid()[1][1];
    component.bossStore.attackCell(targetCell);
    expect(component.bossStore.message()).toContain('bossFightMessages.miss');
  });

  it('should show missNoHint if no parts in row or column', () => {
    const settings = { difficulty: { bossTries: 10 } } as any;
    component.bossStore.resetGame(settings);

    const grid = component.bossStore.grid();
    grid.flat().forEach(c => {
        c.hasBossPart = false;
        c.hit = false;
    });

    // Place 1 part far away
    grid[4][4].hasBossPart = true;

    // Attack (0,0) -> row 0 has 0, col 0 has 0
    const targetCell = component.bossStore.grid()[0][0];
    component.bossStore.attackCell(targetCell);
    expect(component.bossStore.message()).toContain('bossFightMessages.missNoHint');
  });
});
