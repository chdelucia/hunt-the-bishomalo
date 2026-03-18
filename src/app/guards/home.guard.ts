import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';

export const homeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const gameStore = inject(GameStore);
  const gameEngine = inject(GameEngineService);

  const hasSettings = gameStore.settings().size;

  if (hasSettings) {
    gameEngine.initGame();
    return true;
  }
  router.navigateByUrl(RouteTypes.SETTINGS);
  return false;
};
