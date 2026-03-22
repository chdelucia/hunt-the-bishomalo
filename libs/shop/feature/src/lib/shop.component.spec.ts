import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { Router } from '@angular/router';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { Product, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { CommonModule } from '@angular/common';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

const mockHunter = {
  gold: 150,
  lives: 3,
  inventory: [],
};

const mockGameStoreService = {
  hunter: jest.fn(() => mockHunter),
  updateHunter: jest.fn(),
  updateGame: jest.fn(),
  lives: jest.fn().mockReturnValue(3),
  gold: jest.fn().mockReturnValue(160),
  inventory: jest.fn().mockReturnValue([]),
  settings: jest.fn().mockReturnValue({
    difficulty: {
      maxLevels: 10,
      maxChance: 0.35,
      baseChance: 0.12,
      gold: 60,
      maxLives: 8,
      luck: 8,
      bossTries: 12,
    },
  }),
};

const mockGameEngineService = {
  nextLevel: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopComponent, CommonModule, getTranslocoTestingModule()],
      providers: [
        { provide: GAME_STORE_TOKEN, useValue: mockGameStoreService },
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngineService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create the shop component', () => {
    expect(component).toBeTruthy();
  });

  it('should buy a product if gold is sufficient and effect is not heart', (done) => {
    jest.useFakeTimers();
    const product: Product = {
      name: 'product.lantern.name',
      effect: 'lantern',
      description: 'product.lantern.description',
      price: 100,
      icon: 'lantern.svg',
    };

    component.buyProduct(product);
    expect(mockGameStoreService.updateHunter).toHaveBeenCalledWith({
      gold: 60,
      inventory: [product],
    });
    expect(component.message()).toContain('shop.purchaseMessageSuccess');
    jest.advanceTimersByTime(3000);
    expect(component.message()).toBe('');
    jest.useRealTimers();
    done();
  });

  it('should increase lives if product effect is heart', () => {
    const product: Product = {
      name: 'Vida extra',
      effect: 'heart',
      description: 'Una vida más',
      price: 60,
      icon: 'heart.svg',
    };

    component.buyProduct(product);
    expect(mockGameStoreService.updateHunter).toHaveBeenCalledWith({ gold: 100 });
    expect(mockGameStoreService.updateGame).toHaveBeenCalledWith({ lives: 4 });
  });

  it('should not buy a product if it is already in inventory and is not heart', () => {
    const product: Product = {
      name: 'product.lantern.name',
      effect: 'lantern',
      description: 'product.lantern.description',
      price: 100,
      icon: 'lantern.svg',
    };

    mockGameStoreService.inventory.mockReturnValueOnce([product]);

    component.buyProduct(product);
    expect(mockGameStoreService.updateHunter).not.toHaveBeenCalled();
    expect(component.message()).toBe('shop.purchaseMessageAlreadyOwned');
  });

  it('should call nextLevel and navigate to STORY', () => {
    component.nextLevel();
    expect(mockGameEngineService.nextLevel).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([RouteTypes.STORY], {
      state: { fromSecretPath: true },
    });
  });

  it('should show error message if not enough gold', () => {
    const product: Product = {
      name: 'product.lantern.name',
      effect: 'lantern',
      description: 'product.lantern.description',
      price: 1000,
      icon: 'lantern.svg',
    };

    component.buyProduct(product);
    expect(component.message()).toBe('shop.purchaseMessageNotEnoughCoins');
  });

  it('should randomise products based on chance', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ShopComponent, CommonModule, getTranslocoTestingModule()],
      providers: [
        { provide: GAME_STORE_TOKEN, useValue: mockGameStoreService },
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngineService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const fixtureNew = TestBed.createComponent(ShopComponent);
    const componentNew = fixtureNew.componentInstance;

    const products = componentNew.productos();
    expect(products.length).toBeGreaterThan(4);
    randomSpy.mockRestore();
  });

  it('should clear timeout and message on destroy', () => {
    jest.useFakeTimers();
    const product: Product = {
      name: 'product.lantern.name',
      effect: 'lantern',
      description: 'product.lantern.description',
      price: 100,
      icon: 'lantern.svg',
    };

    component.buyProduct(product);
    expect(component.message()).not.toBe('');

    component.ngOnDestroy();

    jest.advanceTimersByTime(3000);
    jest.useRealTimers();
  });

  it('should clear message and timeout when clearMessage is called', () => {
    jest.useFakeTimers();
    const product: Product = {
      name: 'product.lantern.name',
      effect: 'lantern',
      description: 'product.lantern.description',
      price: 100,
      icon: 'lantern.svg',
    };

    component.buyProduct(product);
    component.clearMessage();
    expect(component.message()).toBe('');
    jest.useRealTimers();
  });
});
