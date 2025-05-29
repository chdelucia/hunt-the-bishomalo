import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsComponent } from './instructions.component';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from 'src/app/utils';

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
