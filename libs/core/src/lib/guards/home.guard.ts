import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { GameStore } from '../store';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';

export const homeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const gameStore = inject(GameStore);
  const gameEngine = inject(GAME_ENGINE_TOKEN);

  const hasSettings = gameStore.settings().size;

  if (hasSettings) {
    gameEngine.initGame();
    return true;
  }
  router.navigateByUrl(RouteTypes.SETTINGS);
  return false;
};
