import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlackoutComponent } from './blackout.component';

describe('BlackoutComponent', () => {
  let component: BlackoutComponent;
  let fixture: ComponentFixture<BlackoutComponent>;

  beforeEach(async () => {
    jest.spyOn(window as any, 'Audio').mockImplementation(() => {
      return {
        play: jest.fn(),
        pause: jest.fn(),
        currentTime: 0,
        loop: false,
        volume: 1
      } as unknown as HTMLAudioElement;
    });
    await TestBed.configureTestingModule({
      imports: [BlackoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlackoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
