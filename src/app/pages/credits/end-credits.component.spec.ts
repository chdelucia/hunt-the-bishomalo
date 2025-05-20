import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndCreditsComponent } from './end-credits.component';
import { RouterModule } from '@angular/router';
import { GameEngineService, GameSoundService } from 'src/app/services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const gameEngineMock = {
  initGame: jest.fn(),
  newGame: jest.fn(),
  nextLevel: jest.fn(),
};

const gameSoundMock = {
  playSound: jest.fn(),
  stop: jest.fn(),
};
describe('EndCreditsComponent', () => {
  let component: EndCreditsComponent;
  let fixture: ComponentFixture<EndCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndCreditsComponent, RouterModule.forRoot([])],
      providers: [
        { provide: GameEngineService, useValue: gameEngineMock },
        { provide: GameSoundService, useValue: gameSoundMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EndCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el scrollPosition en 0', () => {
    expect(component.scrollPosition()).toBe(0);
  });

  it('debería tener autoScroll en true por defecto', () => {
    expect(component.autoScroll()).toBe(true);
  });

  it('debería cambiar el estado de autoScroll al hacer toggle', () => {
    const original = component.autoScroll();
    component.toggleAutoScroll();
    expect(component.autoScroll()).toBe(!original);
  });

  it('debería reiniciar el scroll y activar autoScroll', () => {
    component.scrollPosition.set(150);
    component.autoScroll.set(false);

    component.resetScroll();

    expect(component.scrollPosition()).toBe(0);
    expect(component.autoScroll()).toBe(true);
  });

  it('debería tener una lista de roles mayor a 0', () => {
    expect(component.roles().length).toBeGreaterThan(0);
  });

  it('todos los roles deberían ser strings no vacíos', () => {
    const roles = component.roles();
    roles.forEach((role) => {
      expect(typeof role).toBe('string');
      expect(role.length).toBeGreaterThan(0);
    });
  });
});
