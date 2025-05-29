import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { GameEngineService } from 'src/app/services';
import { Router, RouterModule } from '@angular/router';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from 'src/app/utils';


@Component({ template: '' })
class DummyComponent {}

const routes = [
  { path: '', component: DummyComponent },
  { path: 'home', component: DummyComponent },
  { path: 'test-url', component: DummyComponent },
];

const gameEngineServiceMock = {
  newGame: jest.fn(),
};
describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, RouterModule.forRoot(routes), getTranslocoTestingModule()],
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
