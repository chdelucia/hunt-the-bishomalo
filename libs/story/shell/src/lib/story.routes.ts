import { Routes } from '@angular/router';

export const storyRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/story/feature').then(m => m.StoryComponent)
  }
];
