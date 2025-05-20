import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { GameEngineService, GameStoreService } from 'src/app/services';
import { RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { Chars } from 'src/app/models';

const gameEngineServiceMock = {
  newGame: jest.fn(),
};

const hunterSignal = signal({ chars: ['default', 'lara'] });

const gameStoreMock = {
  updateHunter: jest.fn(),
  stop: jest.fn(),
  hunter: jest.fn().mockReturnValue(hunterSignal),
};

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersComponent, RouterModule.forRoot([])],
      providers: [
        { provide: GameEngineService, useValue: gameEngineServiceMock },
        { provide: GameStoreService, useValue: gameStoreMock },
      ],
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
    expect(gameEngineServiceMock.newGame).toHaveBeenCalled();
  });
});
