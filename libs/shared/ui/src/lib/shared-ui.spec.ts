import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleComponent } from './title/title.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

describe('Shared UI Components', () => {
  describe('TitleComponent', () => {
    let component: TitleComponent;
    let fixture: ComponentFixture<TitleComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TitleComponent, getTranslocoTestingModule()],
      }).compileComponents();
      fixture = TestBed.createComponent(TitleComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('blackout', false);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
