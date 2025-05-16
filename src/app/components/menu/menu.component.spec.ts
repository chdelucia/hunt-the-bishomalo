import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { GameEngineService } from 'src/app/services';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { Component } from '@angular/core';

// Ruta dummy para forRoot


@Component({ template: '' })
class DummyComponent {}

const routes = [
  { path: '', component: DummyComponent },
  { path: 'home', component: DummyComponent },
  { path: 'test-url', component: DummyComponent },
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let gameEngineServiceMock: jest.Mocked<GameEngineService>;
  let router: Router;

  beforeEach(async () => {
    gameEngineServiceMock = {
      newGame: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [MenuComponent, RouterModule.forRoot(routes)],
      providers: [{ provide: GameEngineService, useValue: gameEngineServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Spy en navigateByUrl para que no haga navegación real
    jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should create component and have isOpen false by default', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle isOpen signal', () => {
    expect(component.isOpen()).toBe(false);
    component.toggleMenu();
    expect(component.isOpen()).toBe(true);
    component.toggleMenu();
    expect(component.isOpen()).toBe(false);
  });

  it('should navigate to given url and toggle menu', () => {
    component.isOpen.set(true);
    component.nagivateTo('test-url');
    expect(component.isOpen()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/test-url');
  });

  it('should start new game and navigate home', () => {
    component.newGame();
    expect(gameEngineServiceMock.newGame).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});
