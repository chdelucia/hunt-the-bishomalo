import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementsComponent } from './achievements.component';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { Achievement } from 'src/app/models';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from 'src/app/utils';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  const mockAchievements: Achievement[] = [
    { id: '1', title: 'Ach1', unlocked: true, svgIcon: 'icon1', rarity: 'common', description: '' },
    { id: '2', title: 'Ach2', unlocked: false, svgIcon: 'icon2', rarity: 'rare', description: '' },
    { id: '3', title: 'Ach3', unlocked: true, svgIcon: 'icon3', rarity: 'epic', description: '' },
  ];

  const achievementServiceMock = {
    achievements: mockAchievements,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [{ provide: AchievementService, useValue: achievementServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize achievements', () => {
    expect(component).toBeTruthy();
    expect(component.achievements).toEqual(mockAchievements);
  });

  it('should filter all achievements when filter is "all"', () => {
    component.setFilter('all');
    expect(component.filteredAchievements.length).toBe(mockAchievements.length);
  });

  it('should filter only unlocked achievements', () => {
    component.setFilter('unlocked');
    expect(component.filteredAchievements.every((a) => a.unlocked)).toBe(true);
  });

  it('should filter only locked achievements', () => {
    component.setFilter('locked');
    expect(component.filteredAchievements.every((a) => !a.unlocked)).toBe(true);
  });

  it('should correctly compute unlockedCount', () => {
    expect(component.unlockedCount).toBe(2);
  });

  it('should correctly compute percentage', () => {
    expect(component.percentage).toBe(Math.round((2 / 3) * 100));
  });

  it('should return correct rarity color', () => {
    expect(component.getRarityColor('common')).toBe('bg-gray-500');
    expect(component.getRarityColor('rare')).toBe('bg-blue-500');
  });

  it('should return correct rarity name', () => {
    expect(component.getRarityName('epic')).toBe('rarity.epic');
    expect(component.getRarityName('legendary')).toBe('rarity.legendary');
  });
});
