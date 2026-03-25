import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementItemComponent } from './achievement-item.component';
import { getTranslocoTestingModule } from '../utils/transloco-testing';
import { Achievement } from '../models/achievements.model';

describe('AchievementItemComponent', () => {
  let component: AchievementItemComponent;
  let fixture: ComponentFixture<AchievementItemComponent>;

  const mockAchievement: Achievement = {
    id: 'test-1',
    title: 'Test Achievement',
    description: 'Test Description',
    rarity: 'common',
    unlocked: false,
    svgIcon: 'test.png',
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
