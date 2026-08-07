import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigComponent } from './config.component';
import { GAME_CONFIG_COMPONENT } from '@hunt-the-bishomalo/shared-data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { TitleComponent } from '@hunt-the-bishomalo/shared-ui';
import { Component } from '@angular/core';

@Component({
  selector: 'lib-dummy-config',
  template: '<div id="dummy-config">Dummy Config</div>',
  standalone: true,
})
class DummyConfigComponent {}

const mockAchievement = {
  activeAchievement: jest.fn(),
  calcVictoryAchieve: jest.fn(),
  handleWumpusKillAchieve: jest.fn(),
  isAllCompleted: jest.fn(),
};
const mockLeaderboard = { clear: jest.fn() };
const mockGameEngine = { initGame: jest.fn(), newGame: jest.fn() };

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigComponent, TitleComponent, getTranslocoTestingModule()],
      providers: [
        { provide: ACHIEVEMENT_SERVICE, useValue: mockAchievement },
        { provide: LEADERBOARD_SERVICE, useValue: mockLeaderboard },
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngine },
        { provide: GAME_SOUND_TOKEN, useValue: { stop: jest.fn(), playSound: jest.fn() } },
        {
          provide: GAME_STORE_TOKEN,
          useValue: {
            updateGame: jest.fn(),
            unlockedChars: jest.fn().mockReturnValue([]),
            lives: jest.fn().mockReturnValue(3),
          },
        },
        { provide: GAME_CONFIG_COMPONENT, useValue: DummyConfigComponent },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided game config component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dummyEl = compiled.querySelector('#dummy-config');
    expect(dummyEl).toBeTruthy();
    expect(dummyEl?.textContent).toContain('Dummy Config');
  });
});
