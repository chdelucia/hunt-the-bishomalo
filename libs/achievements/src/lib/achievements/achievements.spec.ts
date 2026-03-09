import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementsComponent } from './achievements';
import { Achievement } from '@hunt-the-bishomalo/data';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';
import { signal } from '@angular/core';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  const mockAchievements: Achievement[] = [
    {
      id: '1' as any,
      title: 'Ach1',
      unlocked: true,
      svgIcon: 'icon1',
      rarity: 'common',
      description: '',
    },
    {
      id: '2' as any,
      title: 'Ach2',
      unlocked: false,
      svgIcon: 'icon2',
      rarity: 'rare',
      description: '',
    },
    {
      id: '3' as any,
      title: 'Ach3',
      unlocked: true,
      svgIcon: 'icon3',
      rarity: 'epic',
      description: '',
    },
  ];

  const achievementServiceMock = {
    achievements: mockAchievements,
    completed: signal(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [
        { provide: ACHIEVEMENT_SERVICE, useValue: achievementServiceMock },
        provideNoopAnimations(),
      ],
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
});
