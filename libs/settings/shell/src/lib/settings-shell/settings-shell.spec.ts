import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsShell } from './settings-shell';

describe('SettingsShell', () => {
  let component: SettingsShell;
  let fixture: ComponentFixture<SettingsShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsShell],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
