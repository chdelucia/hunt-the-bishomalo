import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GameEngineService } from 'src/app/services';
import { Product, RouteTypes } from 'src/app/models';
import { Router } from '@angular/router';
import { GameStore } from 'src/app/store';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  // Base product definitions with translation keys
  private readonly baseProducts: Product[] = [
    {
      effect: 'heart',
      name: 'product.heart.name', // Key
      description: 'product.heart.description', // Key
      price: 60,
      icon: 'heart.svg',
    },
    {
      effect: 'shield',
      name: 'product.shield.name', // Key
      description: 'product.shield.description', // Key
      price: 150,
      icon: 'shield.svg',
    },
    {
      effect: 'lantern',
      name: 'product.lantern.name', // Key
      description: 'product.lantern.description', // Key
      price: 100,
      icon: 'lantern.svg',
    },
    {
      effect: 'rewind',
      name: 'product.rewind.name', // Key
      description: 'product.rewind.description', // Key
      price: 200,
      icon: 'clock.svg',
    },
  ];

  private readonly baseRandomProducts: Product[] = [
    {
      effect: 'dragonball',
      name: 'product.dragonball.name', // Key
      description: 'product.dragonball.description', // Key
      price: 125,
      icon: 'b4.png',
    },
    {
      effect: 'apple',
      name: 'product.apple.name', // Key
      description: 'product.apple.description', // Key
      price: 85,
      icon: 'apple.png',
    },
  ];

  private readonly gameStore = inject(GameStore);
  private readonly settings = this.gameStore.settings;
  private readonly gameEngine = inject(GameEngineService);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  readonly gold = this.gameStore.gold;
  readonly inventory = this.gameStore.inventory;

  message = signal('');

  // Computed signal to get translated products
  productos = computed(() => {
    const translatedProducts = this.baseProducts.map((p) => ({
      ...p,
      name: this.transloco.translate(p.name),
      description: this.transloco.translate(p.description),
    }));

    const translatedRandomProducts = this.baseRandomProducts.map((p) => ({
      ...p,
      name: this.transloco.translate(p.name),
      description: this.transloco.translate(p.description),
    }));

    if (Math.random() < this.settings().difficulty.maxChance) {
      return [...translatedProducts, ...translatedRandomProducts];
    }
    return translatedProducts;
  });

  buyProduct(product: Product): void {
    const gold = this.gold();
    const { price, effect, name: nameKey } = product; // nameKey is now the translation key
    const lives = this.gameStore.hunter().lives;

    const canBuy = gold >= price;

    if (!canBuy) {
      this.message.set(this.transloco.translate('shop.purchaseMessageNotEnoughCoins'));
      return;
    }

    if (effect === 'heart') {
      this.addLifeToPlayer({ gold, price, lives });
    } else {
      // We need to pass the original product definition if it contains keys
      // Find the original product from baseProducts or baseRandomProducts
      const originalProduct =
        this.baseProducts.find((p) => p.effect === effect) ||
        this.baseRandomProducts.find((p) => p.effect === effect);
      if (originalProduct) {
        this.addItemToPlayer({ gold, product: originalProduct, price });
      } else {
        // Fallback or error handling if product not found in base definitions
        console.error('Original product definition not found for effect:', effect);
        return;
      }
    }
    // The product.name passed to buyProduct is already translated by the `productos` computed signal.
    // So, we use product.name directly here.
    this.message.set(
      this.transloco.translate('shop.purchaseMessageSuccess', { productName: product.name }),
    );
    setTimeout(() => this.message.set(''), 2000);
  }

  nextLevel(): void {
    this.gameEngine.nextLevel();
    this.router.navigate([RouteTypes.STORY], {
      state: {
        fromSecretPath: true,
      },
    });
  }

  private addLifeToPlayer(data: { gold: number; price: number; lives: number }): void {
    const { gold, price, lives } = data;
    this.gameStore.updateHunter({
      gold: gold - price,
      lives: Math.min(lives + 1, this.gameStore.settings().difficulty.maxLives),
    });
  }

  private addItemToPlayer(data: { gold: number; product: Product; price: number }): void {
    const { gold, product, price } = data;
    const inventory = this.inventory();

    this.gameStore.updateHunter({
      gold: gold - price,
      inventory: [...(inventory || []), product],
    });
  }
}
