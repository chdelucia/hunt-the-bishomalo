import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementFilterComponent } from './achievement-filter.component';
import { AchievementProgressComponent } from './achievement-progress.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

describe('Achievement UI Components', () => {
  describe('AchievementFilterComponent', () => {
    let component: AchievementFilterComponent;
    let fixture: ComponentFixture<AchievementFilterComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AchievementFilterComponent, getTranslocoTestingModule()],
      }).compileComponents();
      fixture = TestBed.createComponent(AchievementFilterComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('currentFilter', 'all');
      fixture.detectChanges();
    });

    it('should emit filterChanged when setFilter is called', () => {
      const spy = jest.spyOn(component.filterChanged, 'emit');
      component.setFilter('unlocked');
      expect(spy).toHaveBeenCalledWith('unlocked');
    });
  });

  describe('AchievementProgressComponent', () => {
    let component: AchievementProgressComponent;
    let fixture: ComponentFixture<AchievementProgressComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AchievementProgressComponent, getTranslocoTestingModule()],
      }).compileComponents();
      fixture = TestBed.createComponent(AchievementProgressComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('unlockedCount', 5);
      fixture.componentRef.setInput('totalCount', 10);
      fixture.componentRef.setInput('percentage', 50);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
