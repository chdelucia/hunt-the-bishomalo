import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JediMindTrickAnimationComponent } from './jedi-mind-trick-animation.component';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from 'src/app/utils';

describe('JediMindTrickAnimationComponent', () => {
  let component: JediMindTrickAnimationComponent;
  let fixture: ComponentFixture<JediMindTrickAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JediMindTrickAnimationComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(JediMindTrickAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
