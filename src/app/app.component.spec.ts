import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import {
  GAME_STORE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
  MINI_BUS_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { signal, Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of } from 'rxjs';

@Component({ selector: 'lib-toast', template: '', standalone: true })
class MockToastComponent { @Input() achievement: any; }

@Component({ selector: 'lib-menu', template: '<ng-content></ng-content>', standalone: true })
class MockMenuComponent { }

@Component({ selector: 'lib-game-controls', template: '', standalone: true })
class MockGameControlsComponent {
  @Input() soundEnabled: any;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        getTranslocoTestingModule(),
        MockToastComponent,
        MockMenuComponent,
        MockGameControlsComponent,
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
            navigate: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { queryParams: {} }
          }
        },
        {
          provide: ACHIEVEMENT_SERVICE,
          useValue: {
            activeAchievement: jest.fn(),
            calcVictoryAchieve: jest.fn(),
            handleWumpusKillAchieve: jest.fn(),
            isAllCompleted: jest.fn(),
            completed: signal(undefined),
            achievements: signal([]),
          },
        },
        { provide: LEADERBOARD_SERVICE, useValue: { clear: jest.fn() } },
        {
          provide: LOCALSTORAGE_SERVICE_TOKEN,
          useValue: { getValue: jest.fn(), setValue: jest.fn() },
        },
        { provide: GAME_SOUND_TOKEN, useValue: { stop: jest.fn(), playSound: jest.fn() } },
        {
          provide: GAME_EVENT_SERVICE_TOKEN,
          useValue: { applyEffectsOnDeath: jest.fn(), applyEffectByCellContent: jest.fn() },
        },
        { provide: MINI_BUS_SERVICE_TOKEN, useValue: { emit: jest.fn(), listen: jest.fn() } },
        {
          provide: GAME_STORE_TOKEN,
          useValue: {
            size: signal(4),
            soundEnabled: signal(true),
            settings: signal({ size: 4, difficulty: { luck: 5 } }),
            hunter: signal({ x: 0, y: 0, direction: 0, arrows: 1 }),
            lives: signal(3),
            board: signal([]),
            message: signal(''),
            isAlive: signal(true),
            hasWon: signal(false),
            isAliveSignal: signal(true),
            syncHunterWithStorage: jest.fn(),
            resetStore: jest.fn(),
            updateGame: jest.fn(),
            updateHunter: jest.fn(),
            setMessage: jest.fn(),
            countWumpusKilled: jest.fn(),
            toggleSound: jest.fn(),
          },
        },
        {
          provide: GAME_ENGINE_TOKEN,
          useValue: {
            newGame: jest.fn(),
            initGame: jest.fn(),
            moveForward: jest.fn(),
            turnLeft: jest.fn(),
            turnRight: jest.fn(),
            shootArrow: jest.fn(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it(`should have as title 'hunt-the-bishomalo'`, () => {
    expect(component.title).toEqual('hunt-the-bishomalo');
  });

  it('should have gameEngine and game store injected', () => {
    expect(component.gameEngine).toBeDefined();
    expect(component.game).toBeDefined();
  });

});
