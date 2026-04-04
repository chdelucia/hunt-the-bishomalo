export interface IGameStore {
  settings: () => { size: number; selectedChar: string };
  hunter: () => { arrows: number; gold: number };
  lives: () => number;
  hasLantern: () => boolean;
  hasShield: () => boolean;
  updateHunter: (u: { arrows?: number; gold?: number }) => void;
  updateGame: (u: { lives?: number }) => void;
}
