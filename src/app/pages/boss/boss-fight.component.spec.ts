import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BossFightComponent } from './boss-fight.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GameStoreService, GameSoundService } from 'src/app/services';
import { GameSound, RouteTypes } from 'src/app/models';

describe('BossFightComponent', () => {
  let component: BossFightComponent;
  let fixture: ComponentFixture<BossFightComponent>;

  const mockHunter = signal({ lives: 3 });

  const gameStoreMock = {
    hunter: mockHunter,
    updateHunter: jest.fn(),
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
      imports: [BossFightComponent, CommonModule, RouterModule.forRoot([])],
      providers: [
        { provide: GameStoreService, useValue: gameStoreMock },
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
    expect(component.message).toContain('¡Golpeaste');
  });

  it('should end game and reveal parts when lives reach 0', () => {
    component.playerLives = 1;
    const cell = component.grid[2][2];
    cell.hasBossPart = false;

    component.attackCell(cell);

    expect(component.gameOver).toBe(true);
    expect(component.message).toContain('El jefe te derrotó');
    expect(component.grid.flat().filter(c => c.hasBossPart && c.hit).length).toBeGreaterThan(0);
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
    expect(component.message).toContain('No te quedan vidas');
  });

  it('should navigate to prize screen on goToprizeScreen', () => {
    component.goToprizeScreen();

    expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.FINISH, false);
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.CHARS], {
      state: { fromSecretPath: true },
    });
  });
});
