import { inject, Injectable } from '@angular/core';
import { AchieveTypes, Cell, GameEventEffectType, GameItem, GameSound } from '../../models';
import { GameSoundService } from '../sound/game-sound.service';
import { AchievementService } from '../achievement/achievement.service';
import { GameStore } from 'src/app/store';
import { createGameEventEffects } from './effects';

type CauseOfDeath = 'pit' | 'wumpus';

export interface GameEventEffect {
  type: GameEventEffectType;
  itemName: string;
  apply: (cell: Cell, prev?: { x: number; y: number }) => void;
  canApply: (cause?: CauseOfDeath) => boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class GameEventService {
  private readonly effects: GameEventEffect[] = createGameEventEffects({
    hasItem: this.hasItem.bind(this),
    handleRewind: this.handleRewind.bind(this),
    handleShield: this.handleShield.bind(this),
    handlePickupArrow: this.handlePickupArrow.bind(this),
    handlePitDeath: this.handlePitDeath.bind(this),
    handleWumpusDeath: this.handleWumpusDeath.bind(this),
    handleDragonball: this.handleDragonball.bind(this),
    extraHeart: this.extraHeart.bind(this),
    extraGold: this.extraGold.bind(this),
    removeFirstItemByEffect: this.removeFirstItemByEffect.bind(this),
  });

  readonly gameStore = inject(GameStore);
  readonly gameSound = inject(GameSoundService);
  readonly gameAchieve = inject(AchievementService);

  applyEffectsOnDeath(cause: CauseOfDeath, cell: Cell, prev: { x: number; y: number }): boolean {
    for (const effect of this.effects) {
      if (effect.canApply(cause)) {
        effect.apply(cell, prev);
        this.gameStore.setMessage(effect.message);
        cell.visited = false;
        return true;
      }
    }

    this.gameStore.updateGame({ isAlive: false });
    return false;
  }

  applyEffectByCellContent(cell: Cell): void {
    const effect = this.effects.find((e) => e.type === cell.content?.type);
    if (effect) {
      effect.apply(cell);
      this.gameStore.setMessage(effect.message);
    }
  }
  private inventory(): GameItem[] {
    return this.gameStore.inventory() ?? [];
  }

  private hasItem(name: string): boolean {
    return this.inventory().some((item) => item.effect === name);
  }

  private removeFirstItemByEffect(name: string): GameItem[] {
    const inv = [...this.inventory()];
    const idx = inv.findIndex((i) => i.effect === name);
    if (idx >= 0) inv.splice(idx, 1);
    return inv;
  }

  private handleRewind(prev?: { x: number; y: number }): void {
    this.gameSound.playSound(GameSound.REWIND, false);
    this.gameStore.updateHunter({
      x: prev?.x,
      y: prev?.y,
      inventory: this.removeFirstItemByEffect('rewind'),
    });
  }

  private handleShield(prev?: { x: number; y: number }): void {
    this.gameSound.playSound(GameSound.SHIELD, false);
    this.gameStore.updateHunter({
      x: prev?.x,
      y: prev?.y,
      inventory: this.removeFirstItemByEffect('shield'),
    });
  }

  private handlePickupArrow(cell: Cell): void {
    this.gameSound.playSound(GameSound.PICKUP, false);
    this.gameAchieve.activeAchievement(AchieveTypes.PICKARROW);
    this.gameStore.updateHunter({
      arrows: (this.gameStore.arrows() || 0) + 1,
    });
    cell.content = undefined;
  }

  private handlePitDeath(): void {
    this.gameSound.playSound(GameSound.PITDIE, false);
    this.gameAchieve.activeAchievement(AchieveTypes.DEATHBYPIT);
    this.gameStore.updateGame({
      lives: this.gameStore.lives() - 1,
    });
  }

  private handleWumpusDeath(): void {
    this.gameSound.playSound(GameSound.SCREAM, false);
    this.gameAchieve.activeAchievement(AchieveTypes.DEATHBYWUMPUES);
    this.gameStore.updateGame({
      lives: this.gameStore.lives() - 1,
    });
  }

  private handleDragonball(cell: Cell): void {
    const dragonballs = this.gameStore.dragonballs() ?? 0;
    if (!dragonballs) {
      this.gameStore.updateHunter({ dragonballs: 1 });
      cell.content = undefined;
      this.gameSound.playSound(GameSound.SUCCESS, false);
    }
  }

  private extraHeart(cell: Cell): void {
    this.gameSound.playSound(GameSound.PICKUP, false);
    this.gameAchieve.activeAchievement(AchieveTypes.PICKHEART);
    this.gameStore.updateGame({
      lives: Math.min(this.gameStore.lives() + 1, this.gameStore.settings().difficulty.maxLives),
    });
    cell.content = undefined;
  }

  private extraGold(cell: Cell): void {
    this.gameSound.playSound(GameSound.PICKUP, false);
    this.gameAchieve.activeAchievement(AchieveTypes.PICKGOLD);
    this.gameStore.updateHunter({
      hasGold: true,
      gold: (this.gameStore.gold() || 0) + this.gameStore.settings().difficulty.gold,
    });
    cell.content = undefined;
  }
}
