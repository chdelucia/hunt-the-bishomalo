import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Chars } from '@hunt-the-bishomalo/data';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { AchievementService } from '@hunt-the-bishomalo/achievements';

const gameStoreMock = {
  updateGame: jest.fn(),
  unlockedChars: () => [],
};

const achievementServiceMock = {
  activeAchievement: jest.fn(),
};

const routerMock = {
  navigateByUrl: jest.fn(),
};

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersComponent, getTranslocoTestingModule()],
      providers: [
        { provide: GameStore, useValue: gameStoreMock },
        { provide: AchievementService, useValue: achievementServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateGame on confirm selection', () => {
    component.selectedChar.set(Chars.LINK);
    component.onClick();
    expect(gameStoreMock.updateGame).toHaveBeenCalled();
  });

  it('should navigate to credits on confirm selection', () => {
    component.selectedChar.set(Chars.LINK);
    component.onClick();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('creditos');
  });
});
