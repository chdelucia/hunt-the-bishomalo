import { Injectable } from '@angular/core';
import { AchieveTypes, Cell, GameEventEffectType, GameItem, GameSound, Hunter } from '../../models';
import { GameStoreService } from '../store/game-store.service';
import { GameSoundService } from '../sound/game-sound.service';
import { AchievementService } from '../achievement/achievement.service';

type CauseOfDeath = 'pit' | 'wumpus';

export interface GameEventEffect {
  type: GameEventEffectType;
  itemName: string;
  apply: (hunter: Hunter, cell: Cell, prev?: { x: number; y: number }) => Hunter;
  canApply: (hunter: Hunter, cause?: CauseOfDeath) => boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class GameEventService {
  private readonly effects: GameEventEffect[] = [
    {
      type: 'rewind',
      itemName: 'rebobinar',
      canApply: (hunter, cause) => cause === 'pit' && this.hasItem(hunter, 'rewind'),
      apply: (hunter, cell, prev) => {
        this.gameSound.playSound(GameSound.REWIND, false);
        this.gameStore.updateHunter({
          ...hunter,
          alive: true,
          x: prev?.x,
          y: prev?.y,
          inventory: this.removeItemByName(hunter, 'rewind'),
        });

        return { ...hunter, alive: true };
      },
      message: '¡Rebobinaste el tiempo y volviste a tu posición anterior!',
    },
    {
      type: 'shield',
      itemName: 'escudo',
      canApply: (hunter, cause) => cause === 'wumpus' && this.hasItem(hunter, 'shield'),
      apply: (hunter, cell, prev) => {
        this.gameSound.playSound(GameSound.SHIELD, false);
        this.gameStore.updateHunter({
          ...hunter,
          alive: true,
          x: prev?.x,
          y: prev?.y,
          inventory: this.removeItemByName(hunter, 'shield'),
        });
        return { ...hunter, alive: true };
      },
      message: '¡Tu escudo bloqueó al Wumpus! pero se rompió.',
    },
    {
      type: 'arrow',
      itemName: 'flecha-extra',
      canApply: (hunter) => this.hasItem(hunter, 'flecha-extra'),
      apply: (hunter, cell) => {
        this.gameSound.playSound(GameSound.PICKUP, false);
        this.gameAchieve.activeAchievement(AchieveTypes.PICKARROW);
        this.gameStore.updateHunter({
          ...hunter,
          arrows: hunter.arrows + 1,
        });
        cell.content = undefined;
        return hunter;
      },
      message: 'Has recogido una flecha.',
    },
    {
      type: 'heart',
      itemName: 'extra-heart',
      canApply: (hunter) => this.hasItem(hunter, 'extra-heart'),
      apply: (hunter, cell) => this.extraHeart(hunter, cell),
      message: 'Has conseguido una vida extra.',
    },
    {
      type: 'gold',
      itemName: 'extra-goldem',
      canApply: (hunter) => this.hasItem(hunter, 'extra-goldem'),
      apply: (hunter, cell) => this.extraGold(hunter, cell),
      message: 'Has recogido el oro, puedes escapar.',
    },
    {
      type: 'pit',
      itemName: 'die-pit',
      canApply: (hunter) => this.hasItem(hunter, 'extra-die'),
      apply: (hunter) => {
        this.gameSound.playSound(GameSound.PITDIE, false);
        this.gameAchieve.activeAchievement(AchieveTypes.DEATHBYPIT);
        this.gameStore.updateHunter({
          ...hunter,
          alive: false,
          lives: hunter.lives - 1,
        });
        return hunter;
      },
      message: '¡Caíste en un pozo!',
    },
    {
      type: 'wumpus',
      itemName: 'die-wumpus',
      canApply: (hunter) => this.hasItem(hunter, 'extra-wumpus'),
      apply: (hunter) => {
        this.gameSound.playSound(GameSound.SCREAM, false);
        this.gameAchieve.activeAchievement(AchieveTypes.DEATHBYWUMPUES);
        this.gameStore.updateHunter({
          ...hunter,
          alive: false,
          lives: hunter.lives - 1,
        });
        return hunter;
      },
      message: '¡El Wumpus te devoró!',
    },
    {
      type: 'dragonball',
      itemName: 'dragonball',
      canApply: (hunter) => this.hasItem(hunter, 'dragonballs'),
      apply: (hunter, cell) => {
        const dragonballs = hunter.dragonballs ?? 0;
        if (dragonballs < 7) {
          this.gameStore.updateHunter({
            dragonballs: dragonballs + 1,
          });
          cell.content = undefined;
          this.gameSound.playSound(GameSound.SUCCESS, false);
        }

        return hunter;
      },
      message: '¡Conseguiste una bola de drac!',
    },
  ];

  constructor(
    private readonly gameStore: GameStoreService,
    private readonly gameSound: GameSoundService,
    private readonly gameAchieve: AchievementService,
  ) {}

  applyEffectsOnDeath(
    hunter: Hunter,
    cause: CauseOfDeath,
    cell: Cell,
    prev: { x: number; y: number },
  ): { hunter: Hunter; message?: string } {
    for (const effect of this.effects) {
      if (effect.canApply(hunter, cause)) {
        const updated = effect.apply(hunter, cell, prev);
        this.gameStore.setMessage(effect.message);
        return { hunter: updated, message: effect.message };
      }
    }
    hunter.alive = false;
    return { hunter };
  }

  applyEffectByItemName(
    hunter: Hunter,
    itemName: string,
    cell: Cell,
  ): { hunter: Hunter; message?: string } {
    const effect = this.effects.find((e) => e.itemName === itemName);
    if (effect?.canApply(hunter)) {
      return { hunter: effect.apply(hunter, cell), message: effect.message };
    }
    return { hunter };
  }

  applyEffectByCellContent(hunter: Hunter, cell: Cell): boolean {
    const effect = this.effects.find((e) => e.type === cell.content?.type);
    if (effect) {
      effect.apply(hunter, cell);
      this.gameStore.setMessage(effect.message);
    }

    return !!effect;
  }

  private hasItem(hunter: Hunter, name: string): boolean {
    return hunter.inventory?.some((item) => item.effect === name) ?? false;
  }

  private removeItemByName(hunter: Hunter, name: string): GameItem[] {
    let found = false;
    const result = [];
    for (const item of hunter.inventory || []) {
      if (!found && item.effect === name) {
        found = true;
        continue;
      }
      result.push(item);
    }
    return result;
  }

  private extraHeart(hunter: Hunter, cell: Cell): Hunter {
    this.gameSound.playSound(GameSound.PICKUP, false);
    this.gameAchieve.activeAchievement(AchieveTypes.PICKHEART);
    this.gameStore.updateHunter({
      ...hunter,
      lives: Math.min(hunter.lives + 1, this.gameStore.settings().difficulty.maxLives),
    });
    cell.content = undefined;
    return hunter;
  }

  private extraGold(hunter: Hunter, cell: Cell): Hunter {
    this.gameSound.playSound(GameSound.PICKUP, false);
    this.gameAchieve.activeAchievement(AchieveTypes.PICKGOLD);
    this.gameStore.updateHunter({
      ...hunter,
      hasGold: true,
      gold: (hunter.gold || 0) + this.gameStore.settings().difficulty.gold,
    });
    cell.content = undefined;
    return hunter;
  }
}
