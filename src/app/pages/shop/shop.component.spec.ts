import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { Router } from '@angular/router';
import { GameEngineService } from 'src/app/services';
import { Product, RouteTypes } from 'src/app/models';
import { CommonModule } from '@angular/common';
import { GameStore } from 'src/app/store';

const mockHunter = {
  gold: 150,
  lives: 3,
  inventory: [],
};

const mockGameStoreService = {
  hunter: jest.fn(() => mockHunter),
  updateHunter: jest.fn(),
  gold: jest.fn().mockReturnValue(160),
  inventory: jest.fn(),
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
      imports: [CommonModule],
      providers: [
        { provide: GameStore, useValue: mockGameStoreService },
        { provide: GameEngineService, useValue: mockGameEngineService },
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

  it('should buy a product if gold is sufficient and effect is not heart', fakeAsync(() => {
    const product: Product = {
      name: 'Linterna',
      effect: 'lantern',
      description: 'Descripción',
      price: 100,
      icon: 'lantern.svg',
    };

    component.buyProduct(product);
    expect(mockGameStoreService.updateHunter).toHaveBeenCalledWith({
      gold: 60,
      inventory: [product],
    });
    expect(component.message()).toContain('¡Has comprado Linterna!');
    tick(2000);
    expect(component.message()).toBe('');
  }));

  it('should increase lives if product effect is heart', () => {
    const product: Product = {
      name: 'Vida extra',
      effect: 'heart',
      description: 'Una vida más',
      price: 60,
      icon: 'heart.svg',
    };

    component.buyProduct(product);
    expect(mockGameStoreService.updateHunter).toHaveBeenCalledWith({
      gold: 100,
      lives: 4,
    });
  });

  it('should call nextLevel and navigate to HOME', () => {
    component.nextLevel();
    expect(mockGameEngineService.nextLevel).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([RouteTypes.STORY], {
      state: { fromSecretPath: true },
    });
  });
});
