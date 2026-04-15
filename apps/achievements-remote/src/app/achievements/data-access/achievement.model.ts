export const ASSETS_BASE_URL = 'https://bold-mouse-42af.c-heredia-naranjo.workers.dev';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  svgIcon: string;
  unlocked: boolean;
  rarity: string;
  date?: string;
}
