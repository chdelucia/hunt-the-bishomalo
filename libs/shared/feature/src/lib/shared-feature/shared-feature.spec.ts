import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedFeature } from './shared-feature';

describe('SharedFeature', () => {
  let component: SharedFeature;
  let fixture: ComponentFixture<SharedFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
