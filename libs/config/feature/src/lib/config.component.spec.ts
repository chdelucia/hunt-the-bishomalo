import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigComponent } from './config.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { ACHIEVEMENT_SERVICE, LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/core/services';
import { TitleComponent } from '@hunt-the-bishomalo/shared-ui';

const mockAchievement = {
  activeAchievement: jest.fn(),
  calcVictoryAchieve: jest.fn(),
  handleWumpusKillAchieve: jest.fn(),
  isAllCompleted: jest.fn(),
};
const mockLeaderboard = { clear: jest.fn() };

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigComponent, TitleComponent, getTranslocoTestingModule()],
      providers: [
        { provide: ACHIEVEMENT_SERVICE, useValue: mockAchievement },
        { provide: LEADERBOARD_SERVICE, useValue: mockLeaderboard },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
