import { InjectionToken } from '@angular/core';

export const GAME_STORE = new InjectionToken<{
  settings: () => { size: number; selectedChar: string };
  hunter: () => { arrows: number; gold: number };
  lives: () => number;
  updateHunter: (u: { arrows?: number; gold?: number }) => void;
  updateGame: (u: { lives?: number }) => void;
}>('GAME_STORE');
