import { Direction } from 'src/app/models';

export function getNextPosition(x: number, y: number, direction: Direction): { x: number; y: number } {
  switch (direction) {
    case Direction.UP:
      return { x, y: y - 1 };
    case Direction.DOWN:
      return { x, y: y + 1 };
    case Direction.LEFT:
      return { x: x - 1, y };
    case Direction.RIGHT:
      return { x: x + 1, y };
    default:
      console.warn(`Unhandled direction: ${direction}`);
      return { x, y };
  }
}

export function isInBounds(x: number, y: number, size: number): boolean {
  return x >= 0 && x < size && y >= 0 && y < size;
}
