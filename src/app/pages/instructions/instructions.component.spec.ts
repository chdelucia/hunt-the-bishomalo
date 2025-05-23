import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsComponent } from './instructions.component';
import { RouterModule } from '@angular/router';

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
