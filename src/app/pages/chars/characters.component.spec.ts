import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { GameStoreService } from 'src/app/services';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Chars } from 'src/app/models';

const hunterSignal = signal({ chars: ['default', 'lara'] });

const gameStoreMock = {
  updateHunter: jest.fn(),
  stop: jest.fn(),
  hunter: jest.fn().mockReturnValue(hunterSignal),
  settings: jest.fn().mockReturnValue({}),
  wumpusKilled: jest.fn(),
  hunterAlive: jest.fn(),
  blackout: jest.fn(),
};

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersComponent, RouterModule.forRoot([])],
      providers: [{ provide: GameStoreService, useValue: gameStoreMock }],
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
