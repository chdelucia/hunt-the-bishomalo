export interface Achievement {
  id: string;
  title: string;
  description: string;
  svgIcon: string;
  unlocked: boolean;
  rarity: string;
  date?: string;
}
