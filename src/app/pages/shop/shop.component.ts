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
  private readonly baseProducts: Product[] = [
    {
      effect: 'heart',
      name: 'product.heart.name',
      description: 'product.heart.description',
      price: 60,
      icon: 'heart.svg',
    },
    {
      effect: 'shield',
      name: 'product.shield.name',
      description: 'product.shield.description',
      price: 150,
      icon: 'shield.svg',
    },
    {
      effect: 'lantern',
      name: 'product.lantern.name',
      description: 'product.lantern.description',
      price: 100,
      icon: 'lantern.svg',
    },
    {
      effect: 'rewind',
      name: 'product.rewind.name',
      description: 'product.rewind.description',
      price: 200,
      icon: 'clock.svg',
    },
  ];

  private readonly baseRandomProducts: Product[] = [
    {
      effect: 'dragonball',
      name: 'product.dragonball.name',
      description: 'product.dragonball.description',
      price: 125,
      icon: 'b4.png',
    },
    {
      effect: 'apple',
      name: 'product.apple.name',
      description: 'product.apple.description',
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

  productos = computed(() => {
    if (Math.random() < this.settings().difficulty.maxChance) {
      return [...this.baseProducts, ...this.baseRandomProducts];
    }
    return this.baseProducts;
  });

  buyProduct(product: Product): void {
    const gold = this.gold();
    const { price, effect } = product;
    const lives = this.gameStore.lives();

    const canBuy = gold >= price;

    setTimeout(() => this.message.set(''), 2000);

    if (!canBuy) {
      this.message.set(this.transloco.translate('shop.purchaseMessageNotEnoughCoins'));
      return;
    }

    if (effect === 'heart') {
      this.addLifeToPlayer({ gold, price, lives });
    } else {
      this.addItemToPlayer({ gold, product: product, price });
    }

    this.message.set(
      this.transloco.translate('shop.purchaseMessageSuccess', { productName: product.name }),
    );
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
    this.gameStore.updateHunter({ gold: gold - price });
    this.gameStore.updateGame({
      lives: Math.min(lives + 1, this.gameStore.settings().difficulty.maxLives),
    });
  }

  private addItemToPlayer(data: { gold: number; product: Product; price: number }): void {
    const { gold, product, price } = data;
    const inventory = this.inventory();

    this.gameStore.updateHunter({
      gold: gold - price,
      inventory: [...(inventory), product],
    });
  }
}
