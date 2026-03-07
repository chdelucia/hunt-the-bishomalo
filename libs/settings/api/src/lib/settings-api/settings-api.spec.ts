import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsApi } from './settings-api';

describe('SettingsApi', () => {
  let component: SettingsApi;
  let fixture: ComponentFixture<SettingsApi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsApi],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsApi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
