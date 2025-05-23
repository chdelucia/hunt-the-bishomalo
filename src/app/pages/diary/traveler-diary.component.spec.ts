import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelerDiaryComponent } from './traveler-diary.component';

describe('TravelerDiaryComponent', () => {
  let component: TravelerDiaryComponent;
  let fixture: ComponentFixture<TravelerDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelerDiaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelerDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
