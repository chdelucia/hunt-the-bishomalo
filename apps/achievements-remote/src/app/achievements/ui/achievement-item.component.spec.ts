import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementItemComponent } from './achievement-item.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { Achievement, AchieveTypes } from '@hunt-the-bishomalo/shared-data';

describe('AchievementItemComponent', () => {
  let component: AchievementItemComponent;
  let fixture: ComponentFixture<AchievementItemComponent>;

  const mockAchievement: Achievement = {
    id: 'test-1',
    name: 'Test Achievement',
    description: 'Test Description',
    rarity: 'common',
    type: AchieveTypes.BOSS_KILLED,
    unlocked: false,
    image: 'test.png',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementItemComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('achievement', mockAchievement);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute the correct rarity class', () => {
    expect(component.rarityClass()).toBe('rarity-common');
  });
});
