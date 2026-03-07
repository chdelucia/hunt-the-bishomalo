import { Route } from '@angular/router';

export const settingsRoutes: Route[] = [
  {
    path: 'settings',
    loadComponent: () => import('@hunt-the-bishomalo/settings-feature').then((m) => m.ConfigComponent),
    title: 'Configuracion | Bisho malo',
  },
  {
    path: 'rules',
    loadComponent: () => import('@hunt-the-bishomalo/settings-feature').then((m) => m.InstructionsComponent),
    title: 'Instrucciones | Bisho malo',
  },
];
