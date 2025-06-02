import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Chars } from 'src/app/models';
import { GameStore } from 'src/app/store';
import { getTranslocoTestingModule } from 'src/app/utils';
import { GameSoundService } from 'src/app/services';

const hunterSignal = signal({ chars: ['default', 'lara'] });

const mockGameSound = {
  play: jest.fn(),
};

const gameStoreMock = {
  updateHunter: jest.fn(),
  stop: jest.fn(),
  hunter: jest.fn().mockReturnValue(hunterSignal),
  settings: jest.fn().mockReturnValue({}),
  wumpusKilled: jest.fn(),
  isAlive: jest.fn(),
  blackout: jest.fn(),
  lives: jest.fn(),
};

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [
        { provide: GameStore, useValue: gameStoreMock },
        { provide: GameSoundService, useValue: mockGameSound },
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

  it('should call updateHunter on confirm selection', () => {
    component.selectedChar.set(Chars.LINK);
    component.onClick();
    expect(gameStoreMock.updateHunter).toHaveBeenCalled();
  });
});
