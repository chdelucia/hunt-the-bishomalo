import { Point } from './point.model';

export function isInBounds(x: number, y: number, size: number): boolean {
  return x >= 0 && y >= 0 && x < size && y < size;
}

export function getAdjacentPositions(x: number, y: number, size: number): Point[] {
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];

  return directions
    .map((dir) => ({ x: x + dir.x, y: y + dir.y }))
    .filter((pos) => isInBounds(pos.x, pos.y, size));
}

export function getRandomPosition(size: number): Point {
  /**
   * Security Hotspot Justification:
   * Math.random() is used here for game mechanics (random coordinate selection).
   * It does not involve any security-sensitive operations.
   */
  const x = Math.floor(Math.random() * size);
  const y = Math.floor(Math.random() * size);
  return { x, y };
}
