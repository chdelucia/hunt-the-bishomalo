import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteTypes } from '../models';
import { GameStore } from '../store';
import { GameEngineService } from '../services';

export const homeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const gameStore = inject(GameStore);
  const gameEngine = inject(GameEngineService);
  
  const hasSettings = gameStore.settings();

  if (hasSettings) {
    gameEngine.initGame();
    return true;
  }
  router.navigateByUrl(RouteTypes.SETTINGS);
  return false;
};
