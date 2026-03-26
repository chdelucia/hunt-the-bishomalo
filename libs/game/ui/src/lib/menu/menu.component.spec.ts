import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

@Component({ template: '' })
export class DummyComponent {}

const routes = [
  { path: '', component: DummyComponent },
  { path: 'home', component: DummyComponent },
  { path: 'test-url', component: DummyComponent },
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, RouterModule.forRoot(routes), getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

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
    component.navigateTo('test-url');
    expect(component.isOpen()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/test-url');
  });

  it('should start new game and navigate home', () => {
    const spy = jest.spyOn(component.newGameRequested, 'emit');
    component.newGame();
    expect(spy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/settings');
  });
});
