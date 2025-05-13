export interface Cell {
  x: number;
  y: number;
  hasWumpus?: boolean;
  hasGold?: boolean;
  hasPit?: boolean;
  isStart?: boolean;
  visited?: boolean;
  hasArrow?: boolean;
}
