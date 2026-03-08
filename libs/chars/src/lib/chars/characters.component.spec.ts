import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
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

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [
        { provide: GameStore, useValue: gameStoreMock },
        { provide: AchievementService, useValue: achievementServiceMock },
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
});
