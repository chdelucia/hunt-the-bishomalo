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
  readonly productos: Product[] = [
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

  private readonly gameStore = inject(GameStoreService);
  private readonly gameEngine = inject(GameEngineService);
  private readonly router = inject(Router);

  readonly gold = computed(() => this.gameStore.hunter().gold);
  readonly inventory = computed<GameItem[] | undefined>(() => this.gameStore.hunter().inventory);

  message = signal('');

  buyProduct(product: Product): void {
    const gold = this.gold();
    const { price, effect } = product;
    const inventory = this.inventory();
    const lives = this.gameStore.hunter().lives;

    if (gold >= price) {
      if (effect === 'heart') {
        this.gameStore.updateHunter({ gold: gold - price, lives: Math.min(lives + 1, this.gameStore.settings().difficulty.maxLives) });
      } else {
        this.gameStore.updateHunter({
          gold: gold - price,
          inventory: [...(inventory || []), product],
        });
      }

      this.message.set(`¡Has comprado ${product.name}!`);
    } else {
      this.message.set('¡No tienes suficientes monedas!');
    }
    setTimeout(() => this.message.set(''), 2000);
  }

  nextLevel(): void {
    this.gameEngine.nextLevel();
    this.router.navigate([RouteTypes.HOME]);
  }
}
