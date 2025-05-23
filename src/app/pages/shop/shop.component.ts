import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService, GameStoreService } from 'src/app/services';
import { GameItem, Product, RouteTypes } from 'src/app/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  readonly products: Product[] = [
    {
      effect: 'heart',
      name: 'Vida extra',
      description: 'Te da una oportunidad más para sobrevivir.',
      price: 60,
      icon: 'heart.svg',
    },
    {
      effect: 'shield',
      name: 'Escudo',
      description: 'Te protege de un ataque del bishomalo.',
      price: 150,
      icon: 'shield.svg',
    },
    {
      effect: 'lantern',
      name: 'Linterna',
      description: 'Ya hubo un apagón quien sabe si habrá más.',
      price: 100,
      icon: 'lantern.svg',
    },
    {
      effect: 'rewind',
      name: 'Reloj de arena',
      description: 'Rebobina el tiempo y evita que caigas al fondo de un pozo.',
      price: 200,
      icon: 'clock.svg',
    },
  ];

  readonly randomProduct: Product[] = [
    {
      effect: 'dragonball',
      name: 'Una bola 4',
      description:
        'No se muy bien para que sirve, la encontré en un arbusto. Te la dejo baratita...',
      price: 125,
      icon: 'b4.png',
    },
    {
      effect: 'apple',
      name: 'Una manzana',
      description: 'Siempre va bien una para el hambre. De algun apuro te sacará.',
      price: 85,
      icon: 'apple.png',
    },
  ];

  private readonly gameStore = inject(GameStoreService);
  private readonly settings = this.gameStore.settings;
  private readonly gameEngine = inject(GameEngineService);
  private readonly router = inject(Router);

  readonly gold = computed(() => this.gameStore.hunter().gold);
  readonly inventory = computed<GameItem[] | undefined>(() => this.gameStore.hunter().inventory);

  message = signal('');
  productos = computed(() => {
    const products = this.products;
    if (Math.random() < this.settings().difficulty.maxChance) {
      return [...products, ...this.randomProduct];
    }
    return products;
  });

  buyProduct(product: Product): void {
    const gold = this.gold();
    const { price, effect } = product;
    const lives = this.gameStore.hunter().lives;

    const canBuy = gold >= price;

    if (!canBuy) {
      this.message.set('¡No tienes suficientes monedas!');
      return;
    }

    if (effect === 'heart') {
      this.addLifeToPlayer({ gold, price, lives });
    } else {
      this.addItemToPlayer({ gold, product, price });
    }

    this.message.set(`¡Has comprado ${product.name}!`);
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
