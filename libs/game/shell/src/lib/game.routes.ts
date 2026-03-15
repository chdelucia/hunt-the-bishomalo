import { Route } from '@angular/router';
import { Game } from '@hunt-the-bishomalo/game/feature';

export const gameRoutes: Route[] = [
  {
    path: '',
    component: Game,
  },
];
