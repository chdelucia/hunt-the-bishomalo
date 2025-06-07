import { inject, Injectable } from '@angular/core';
import { AchieveTypes, Cell, GameEventEffectType, GameItem, GameSound } from '../../models';
import { GameSoundService } from '../sound/game-sound.service';
import { AchievementService } from '../achievement/achievement.service';
import { GameStore } from 'src/app/store';

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
  private readonly effects: GameEventEffect[] = [
    {
      type: 'rewind',
      itemName: 'rebobinar',
      canApply: (cause) => cause === 'pit' && this.hasItem('rewind'),
      apply: (cell, prev) => {
        this.gameSound.playSound(GameSound.REWIND, false);
        this.gameStore.updateHunter({
          x: prev?.x,
          y: prev?.y,
          inventory: this.removeItemByName('rewind'),
        });
      },
      message: '¡Rebobinaste el tiempo y volviste a tu posición anterior!',
    },
    {
      type: 'shield',
      itemName: 'escudo',
      canApply: (cause) => cause === 'wumpus' && this.hasItem('shield'),
      apply: (cell, prev) => {
        this.gameSound.playSound(GameSound.SHIELD, false);
        this.gameStore.updateHunter({
          x: prev?.x,
          y: prev?.y,
          inventory: this.removeItemByName('shield'),
        });
      },
      message: '¡Tu escudo bloqueó al Wumpus! pero se rompió.',
    },
    {
      type: 'arrow',
      itemName: 'flecha-extra',
      canApply: () => this.hasItem('flecha-extra'),
      apply: (cell) => {
        this.gameSound.playSound(GameSound.PICKUP, false);
        this.gameAchieve.activeAchievement(AchieveTypes.PICKARROW);
        this.gameStore.updateHunter({
          arrows: this.gameStore.arrows() + 1,
        });
        cell.content = undefined;
      },
      message: 'Has recogido una flecha.',
    },
    {
      type: 'heart',
      itemName: 'extra-heart',
      canApply: () => this.hasItem('extra-heart'),
      apply: (cell) => this.extraHeart(cell),
      message: 'Has conseguido una vida extra.',
    },
    {
      type: 'gold',
      itemName: 'extra-goldem',
      canApply: () => this.hasItem('extra-goldem'),
      apply: (cell) => this.extraGold(cell),
      message: 'Has recogido el oro, puedes escapar.',
    },
    {
      type: 'pit',
      itemName: 'die-pit',
      canApply: () => this.hasItem('extra-die'),
      apply: () => {
        this.gameSound.playSound(GameSound.PITDIE, false);
        this.gameAchieve.activeAchievement(AchieveTypes.DEATHBYPIT);
        this.gameStore.updateGame({
          lives: this.gameStore.lives() - 1,
        });
      },
      message: '¡Caíste en un pozo!',
    },
    {
      type: 'wumpus',
      itemName: 'die-wumpus',
      canApply: () => this.hasItem('extra-wumpus'),
      apply: () => {
        this.gameSound.playSound(GameSound.SCREAM, false);
        this.gameAchieve.activeAchievement(AchieveTypes.DEATHBYWUMPUES);
        this.gameStore.updateGame({
          lives: this.gameStore.lives() - 1,
        });
      },
      message: '¡El Wumpus te devoró!',
    },
    {
      type: 'dragonball',
      itemName: 'dragonball',
      canApply: () => this.hasItem('dragonballs'),
      apply: (cell) => {
        const dragonballs = this.gameStore.dragonballs() ?? 0;
        if (!dragonballs) {
          this.gameStore.updateHunter({
            dragonballs: 1,
          });
          cell.content = undefined;
          this.gameSound.playSound(GameSound.SUCCESS, false);
        }
      },
      message: '¡Conseguiste una bola de drac con 4 estrellas!',
    },
  ];

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

  private hasItem(name: string): boolean {
    return this.gameStore.inventory().some((item) => item.effect === name) ?? false;
  }

  private removeItemByName(name: string): GameItem[] {
    let found = false;
    const result = [];
    for (const item of this.gameStore.inventory() || []) {
      if (!found && item.effect === name) {
        found = true;
        continue;
      }
      result.push(item);
    }
    return result;
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
