import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { signal } from '@angular/core';
import { Product } from '@hunt-the-bishomalo/shared-data';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  const mockGameStore = {
    gold: signal(100),
    inventory: signal([] as any[]),
    settings: signal({ difficulty: { maxChance: 0.5, maxLives: 3 } }),
    lives: signal(3),
    updateHunter: jest.fn(),
    updateGame: jest.fn(),
  };

  const mockGameEngine = {
    nextLevel: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockGameStore.gold.set(100);
    mockGameStore.inventory.set([]);
    mockGameStore.lives.set(3);

    await TestBed.configureTestingModule({
      imports: [ShopComponent, getTranslocoTestingModule()],
      providers: [
        { provide: GAME_STORE_TOKEN, useValue: mockGameStore },
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngine },
        { provide: Router, useValue: mockRouter },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate productos based on random and settings', () => {
    expect(component.productos().length).toBeGreaterThanOrEqual(4);
  });

  it('should buy a product if enough gold and not owned', () => {
    const product: Product = {
      effect: 'shield',
      name: 'Shield',
      description: 'Shield desc',
      price: 50,
      icon: 'shield.svg',
    };

    component.buyProduct(product);

    expect(mockGameStore.updateHunter).toHaveBeenCalledWith(
      expect.objectContaining({ gold: 50 })
    );
    expect(component.message()).toContain('shop.purchaseMessageSuccess');
  });

  it('should not buy a product if not enough gold', () => {
    const product: Product = {
      effect: 'shield',
      name: 'Shield',
      description: 'Shield desc',
      price: 150,
      icon: 'shield.svg',
    };
    mockGameStore.gold.set(100);

    component.buyProduct(product);

    expect(mockGameStore.updateHunter).not.toHaveBeenCalled();
    expect(component.message()).toBe('shop.purchaseMessageNotEnoughCoins');
  });

  it('should not buy a product if already owned', () => {
    const product: Product = {
      effect: 'shield',
      name: 'Shield',
      description: 'Shield desc',
      price: 50,
      icon: 'shield.svg',
    };
    mockGameStore.gold.set(100);
    mockGameStore.inventory.set([{ effect: 'shield' }]);

    component.buyProduct(product);

    expect(mockGameStore.updateHunter).not.toHaveBeenCalled();
    expect(component.message()).toBe('shop.purchaseMessageAlreadyOwned');
  });

  it('should add life when buying heart', () => {
    const product: Product = {
      effect: 'heart',
      name: 'Heart',
      description: 'Heart desc',
      price: 60,
      icon: 'heart.svg',
    };
    mockGameStore.gold.set(100);
    mockGameStore.lives.set(1);

    component.buyProduct(product);

    expect(mockGameStore.updateHunter).toHaveBeenCalledWith({ gold: 40 });
    expect(mockGameStore.updateGame).toHaveBeenCalledWith({ lives: 2 });
  });

  it('should call nextLevel and navigate on nextLevel()', () => {
    component.nextLevel();
    expect(mockGameEngine.nextLevel).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
