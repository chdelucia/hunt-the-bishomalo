import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedDirectives } from './shared-directives';

describe('SharedDirectives', () => {
  let component: SharedDirectives;
  let fixture: ComponentFixture<SharedDirectives>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDirectives],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDirectives);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
