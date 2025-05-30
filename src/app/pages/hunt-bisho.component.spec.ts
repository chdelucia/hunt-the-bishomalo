import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HuntBishoComponent } from './hunt-bisho.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameStore } from '../store';
import { getTranslocoTestingModule } from '../utils';

function createMockCell(overrides = {}) {
  return {
    x: 0,
    y: 0,
    ...overrides,
  };
}

const mockGameStoreService = {
  hunter: jest.fn().mockReturnValue({ arrows: 3, hasGold: false }),
  wumpusKilled: jest.fn(),
  hunterAlive: jest.fn(),
  blackout: jest.fn(),
  startTime: jest.fn(),
  char: jest.fn(),
  settings: jest.fn().mockReturnValue({
    size: 4,
    arrows: 2,
    difficulty: {
      baseChance: 0.12,
      gold: 60,
      luck: 8,
      maxChance: 0.35,
      maxLevels: 10,
      maxLives: 8,
      bossTries: 12,
    },
  }),
  message: jest.fn().mockReturnValue('¡El Wumpus te devoró!'),
  setMessage: jest.fn(),
  board: jest.fn().mockReturnValue([
    [createMockCell({ x: 0, y: 0 }), createMockCell({ x: 0, y: 1 })],
    [createMockCell({ x: 1, y: 0 }), createMockCell({ x: 1, y: 1 })],
  ]),
};

describe('HuntBishoComponent', () => {
  let component: HuntBishoComponent;
  let fixture: ComponentFixture<HuntBishoComponent>;

  beforeEach(async () => {
    jest.spyOn(window, 'Audio').mockImplementation(() => {
      return {
        play: jest.fn(),
        pause: jest.fn(),
        currentTime: 0,
        loop: false,
        volume: 1,
      } as unknown as HTMLAudioElement;
    });

    await TestBed.configureTestingModule({
      imports: [HuntBishoComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [{ provide: GameStore, useValue: mockGameStoreService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HuntBishoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute deathByWumpus as true when message is from wumpus', () => {
    expect(component.deathByWumpus()).toBe(true);
  });

  it('should call setMessage with GAME OVER prefix on handleClose', () => {
    component.handleclose();
    expect(mockGameStoreService.setMessage).toHaveBeenCalledWith('GAME OVER ¡El Wumpus te devoró!');
  });
});
